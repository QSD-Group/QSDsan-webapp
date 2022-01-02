import datetime
import json
import logging
import os
import pandas as pd
import numpy as np
import country_converter as coco
import biosteam as bst
from matplotlib import pyplot as plt
from qsdsan import ImpactItem
from exposan import bwaise as bw

logger = logging.getLogger()
logger.setLevel(logging.INFO)

systems = bw.systems
sys_all = sysA, sysB, sysC = bw.sysA, bw.sysB, bw.sysC

# Functions to calculate cost and impact indicators
get_cost = lambda tea, ppl: (tea.annualized_equipment_cost-tea.net_earnings)/ppl
get_ghg = lambda lca, ppl: lca.total_impacts['GlobalWarming']/lca.lifetime/ppl

get_ppl = systems.get_ppl
streams_dct = systems.sys_dct['stream_dct'].copy()
bwaise_dct = {}
for sys in sys_all:
    sys.simulate()
    ABC = sys.ID[-1]
    tea = sys.TEA
    lca = sys.LCA
    ppl = get_ppl(ABC)
    streams_dct[ABC] = streams_dct.pop(sys.ID)
    bwaise_dct[f'cost{ABC}'] = get_cost(tea, ppl)
    bwaise_dct[f'ghg{ABC}'] = get_ghg(lca, ppl)

units_dct = {
    'A': dict(Excretion=systems.A1, Trucking=(systems.A3,), LumpedCost=systems.A4),
    'B': dict(Excretion=systems.B1, Trucking=(systems.B3,), LumpedCost=systems.B4),
    'C': dict(Excretion=systems.C1, Trucking=(systems.C3, systems.C4), LumpedCost=systems.C5),
}

price_dct = systems.price_dct
price_factor = systems.price_factor
E_item = ImpactItem.get_item('E_item')

# =============================================================================
# Update values and calculate results
# =============================================================================

# Import data
folder = os.path.dirname(__file__)
path = os.path.join(folder, 'ContextualParameters.xlsx')
file = pd.ExcelFile(path)
read_excel = lambda name: pd.read_excel(file, name) # name is sheet name

def get_country_val(sheet, country, index_col='Code', val_col='Value'):
    df = read_excel(sheet) if isinstance(sheet, str) else sheet
    idx = df[df.loc[:, index_col]==country].index
    val = df.loc[idx, val_col]

    # When no country-specific data or no this country, use continental data
    if (val.isna().any() or val.size==0):
        idx = df[df.loc[:, index_col]==get_continent(country)].index
        val = df.loc[idx, val_col]

        # If not even continental data or no this country, use world data
        if (val.isna().any() or val.size==0):
            idx = df[df.loc[:, index_col]=='World'].index
            val = df.loc[idx, val_col]
    return val.values.item()


# continent_info = read_excel('Countries')
countries = read_excel('Countries')
def get_continent(country_code):
    region = countries[countries.Code==country_code].Region
    return region.item()


# Transportation fee and WWTP CAPEX,
# used in price adjustment based on the price ratio level
exchange_rate = systems.get_exchange_rate()
uganda_costing = {
    'A3': systems.A3.fee/exchange_rate,
    'B3': systems.B3.fee/exchange_rate,
    'C3': systems.C3.fee/exchange_rate,
    'C4': systems.C4.fee/exchange_rate,
    'A4': systems.A4.CAPEX_dct['Lumped WWTP'],
    'B4': systems.B4.CAPEX_dct['Lumped WWTP'],
    'C5': systems.C5.CAPEX_dct['Lumped WWTP'],
    'ratio': get_country_val('Price Level Ratio', 'UGA')
}

# Biogas, use the baseline energy/mass (50 MJ/kg) and
# 26 MJ/L to calculate density
rho_LPG = 26 / systems.LPG_energy # (MJ/L / MJ/kg = kg/L)
biogas_factor = systems.get_biogas_factor()

# Energy mix
energy_mix = read_excel('Energy Mix')
energy_mix_updated = energy_mix.copy()
energy_mix_ghg = read_excel('Energy Mix GHG Impacts')
energy_mix_ghg_t = energy_mix_ghg.transpose()

for val in ('expected', 'minimum', 'maximum'):
    ghg = energy_mix_ghg_t.loc[val]
    ghg_cf = (energy_mix.iloc[:, 4:].values * np.tile(ghg, (250,1))).sum(axis=1)
    energy_mix_updated[f'Impact_CF_{val}'] = ghg_cf

def get_results(params):
    caloric_intake = float(params['caloric_intake'])
    animal_protein = float(params['animal_protein_intake'])
    vegetable_protein = float(params['vegetable_protein_intake'])
    food_waste_ratio = float(params['food_waste_ratio']) / 100
    price_level_ratio = float(params.get('price_level_ratio', 1.))

    N_price = float(params['n_fertilizer_price']) or price_dct['N']
    P_price = float(params['p_fertilizer_price']) or price_dct['P']
    K_price = float(params['k_fertilizer_price']) or price_dct['K']
    LPG_price = float(params['liquid_petroleum_gas_price']) or price_dct['Biogas']
    income_tax = float(params['income_tax'])
    unskilled_wage = float(params['unskilled_labor_wage']) or systems.unskilled_salary/exchange_rate
    skilled_wage = float(params['skilled_labor_wage']) or systems.skilled_salary/exchange_rate

    # These values can be updated together for all systems
    bst.PowerUtility.price = float(params['electricity_price']) or bst.PowerUtility.price
    E_item.CFs['GlobalWarming'] = float(params['electricity_impact_factor']) \
                                  or E_item.CFs['GlobalWarming']

    results_dct = {}
    for sys in sys_all:
        tea = sys.TEA
        lca = sys.LCA

        ABC = sys.ID[-1]
        ppl = get_ppl(ABC)

        streams = streams_dct[ABC]
        units = units_dct[ABC]
        Excretion, Trucking, LumpedCost = units.values()

        # Set values, keep original values if no new value
        Excretion.e_cal = caloric_intake or Excretion.e_cal
        Excretion.p_anim = animal_protein or Excretion.p_anim
        Excretion.p_veg = vegetable_protein or Excretion.p_veg
        Excretion.waste_ratio = food_waste_ratio or Excretion.waste_ratio

        for u in Trucking:
            u.fee = uganda_costing[u.ID]/uganda_costing[u.ID]*price_level_ratio

        LumpedCost.CAPEX_dct['Lumped WWTP'] = \
            uganda_costing[LumpedCost.ID]/uganda_costing[LumpedCost.ID]*price_level_ratio

        streams['liq_N'].price = streams['sol_N'].price = N_price * price_factor
        streams['liq_P'].price = streams['sol_P'].price = P_price * price_factor
        streams['liq_K'].price = streams['sol_K'].price = K_price * price_factor

        tea.income_tax = income_tax or tea.income_tax

        if ABC == 'B':
            skilled_num = systems.skilled_num
            unskilled_num = systems.unskilled_num
            streams['biogas'].price = (LPG_price/rho_LPG)*biogas_factor
        else:
            skilled_num = 4
            unskilled_num = 8

        tea.annual_labor = (skilled_wage*skilled_num+unskilled_wage*unskilled_num)*12
        tea.annual_labor = (skilled_wage*skilled_num+unskilled_wage*unskilled_num)*12

        sys.simulate()
        results_dct[f'cost{ABC}'] = get_cost(tea, ppl)
        results_dct[f'ghg{ABC}'] = get_ghg(lca, ppl)

    return results_dct

def handler(event, context):
    response = {
        "statusCode": 500,
        "body": json.dumps({
            "message": "Internal Server Error"
        })
    }

    try:
        logger.info("Request: %s", event)

        # GET request only
        http_method = 'GET'
        if 'httpMethod' in event:
            http_method = event['httpMethod']

        # Either take query params OR body (GET request only)
        params = event
        if 'queryStringParameters' in event:
            params = event['queryStringParameters']

        if http_method == 'GET' and params is not None:
            a = datetime.datetime.now()
            res_dct = get_results(event)  # params
            b = datetime.datetime.now()
            delta = b - a

            response = {
                "statusCode": 200,
                "body": json.dumps({
                    "message": "success",
                    "data": res_dct,
                    "time": int(delta.total_seconds() * 1000),
                }),
            }
        else:
            response = {
                "statusCode": 400,
                "body": json.dumps({
                    "message": "Only GET or missing parameters"
                }),
            }

        #logger.info("Response: %s", response)

        return response
    except Exception as e:
        exception_type = e.__class__.__name__
        exception_message = str(e)

        api_exception_obj = {
            "isError": True,
            "type": exception_type,
            "message": exception_message
        }

        api_exception_json = json.dumps(api_exception_obj)
        raise LambdaException(api_exception_json)
    finally:
        return response


# Simple Exception wrappers
class ClientException(Exception):
    pass

class LambdaException(Exception):
    pass

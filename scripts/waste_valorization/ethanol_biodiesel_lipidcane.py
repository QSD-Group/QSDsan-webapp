#!/usr/bin/env python3
# -*- coding: utf-8 -*-

'''
QSDsan-webapp: Web application for QSDsan

This module is developed by:
    
    Yalin Li <mailto.yalin.li@gmail.com>

This module is under the University of Illinois/NCSA Open Source License.
Please refer to https://github.com/QSD-Group/QSDsan/blob/main/LICENSE.txt
for license details.

Part of the codes is based on the Bioindustrial-Park repository:
https://github.com/BioSTEAMDevelopmentGroup/Bioindustrial-Park/blob/master/biorefineries/lipidcane/_webapp_model.py
'''

import warnings
warnings.filterwarnings('ignore')

import biosteam as bst
from biorefineries import lipidcane as lc
from biosteam.evaluation import Model, Metric
from biosteam.evaluation.evaluation_tools import triang
from biosteam.process_tools import UnitGroup


# %% Create metrics 

ethanol_density = 2.9866 # kg/gallon
tea = lc.lipidcane_tea
ugroup = UnitGroup('Biorefinery', tea.units)
get_steam_demand = lambda: sum([i.flow for i in lc.BT.steam_utilities]) * 18.01528 * tea.operating_hours / 1000
get_electricity_consumption = ugroup.get_electricity_consumption
get_electricity_production = ugroup.get_electricity_production
get_excess_electricity = lambda: get_electricity_production() - get_electricity_consumption()
get_ethanol_production = lambda: lc.ethanol.F_mass * tea.operating_hours / 907.185
get_biodiesel_production = lambda: lc.biodiesel.F_mass * tea.operating_hours / 907.185
get_MESP = lambda: tea.solve_price(lc.ethanol) * ethanol_density
get_MFPP = lambda: tea.solve_price(lc.lipidcane)
get_IRR = lambda: tea.solve_IRR() * 100
get_FCI = lambda: tea.FCI / 10**6

metrics = (Metric('IRR', get_IRR, '%'),
           Metric('MFPP', get_MFPP, 'USD/kg'),
           Metric('MESP', get_MESP, 'USD/gal'), 
           Metric('FCI', get_FCI, 'million USD'),
           Metric('Biodiesel production', get_biodiesel_production, 'ton/yr'),
           Metric('Ethanol production', get_ethanol_production, 'ton/yr'),
           Metric('Steam demand', get_steam_demand, 'MT/yr'),
           Metric('Consumed electricity', get_electricity_consumption, 'MW'),
           Metric('Excess electricity', get_excess_electricity, 'MW'))

# Used to index metrics by name
metrics_by_name = {i.name: i for i in metrics}

# %% Create model and populate parameters

def create_model():

    #: [float] Plant size process specification in ton / yr
    plant_size_ = lc.lipidcane.F_mass * lc.lipidcane_tea.operating_days * 24 / 907.185
    def load_specifications():
        # Plant size
        lc.lipidcane.F_mass = plant_size_ / (lc.lipidcane_tea.operating_days * 24 / 907.185)
    
    model = Model(lc.lipidcane_sys, metrics, load_specifications)
    param = model.parameter
    
    @param(units='ton/yr',
           distribution=triang(plant_size_),
           baseline=plant_size_)
    def set_plant_size(plant_size):
        global plant_size_
        plant_size_ = plant_size
    
    @param(units='days/yr', 
           distribution=triang(tea.operating_days),
           baseline=tea.operating_days)
    def set_operating_days(operating_days):
        tea.operating_days = operating_days
        
    @param(element=lc.ethanol, units='USD/kg',
           distribution=triang(lc.ethanol.price),
           baseline=lc.ethanol.price)
    def set_ethanol_price(price):
        lc.ethanol.price = price
        
    @param(element=lc.lipidcane, units='USD/kg',
           distribution=triang(lc.lipidcane.price),
           baseline=lc.lipidcane.price)
    def set_lipidcane_price(price):
        lc.lipidcane.price = price
    
    @param(element='TEA', units='USD/kWhr',
           distribution=triang(bst.PowerUtility.price),
           baseline=bst.PowerUtility.price)
    def set_electricity_price(price):
        bst.PowerUtility.price = price
    
    @param(element='TEA', units='%',
           distribution=triang(100. * tea.IRR),
           baseline=100. * tea.IRR)
    def set_IRR(IRR):
        tea.IRR = IRR / 100.
    
    model.get_parameters()[-1].name = 'IRR'
    
    return model


# %%

if __name__ == '__main__':
    model = create_model()
    df = model.metrics_at_baseline()

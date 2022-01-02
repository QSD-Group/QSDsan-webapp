#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Sat Oct 16 09:03:07 2021

@author: Yalin Li

NOTE: This code is adapted from https://github.com/QSD-Group/QSDedu/blob/main/C.%20Interactive%20Modules/C3/functions.py
"""

# %%
import json
import csv
import os
import pandas as pd
import numpy as np
import country_converter as coco

# %%

# =============================================================================
# Update values and calculate results
# =============================================================================

# Import data
folder = os.path.dirname(__file__)
path = os.path.join(folder, 'ContextualParameters.xlsx')
countriesPath = os.path.join(folder, 'countries.csv')
file = pd.ExcelFile(path)
read_excel = lambda name: pd.read_excel(file, name)  # name is sheet name


def get_country_val(sheet, country, index_col='Code', val_col='Value'):
    df = read_excel(sheet) if isinstance(sheet, str) else sheet
    idx = df[df.loc[:, index_col] == country].index
    val = df.loc[idx, val_col]

    # When no country-specific data or no this country, use continental data
    if val.isna().any() or val.size == 0:
        idx = df[df.loc[:, index_col] == get_continent(country)].index
        val = df.loc[idx, val_col]

        # If not even continental data or no this country, use world data
        if val.isna().any() or val.size == 0:
            idx = df[df.loc[:, index_col] == 'World'].index
            val = df.loc[idx, val_col]

    return val.values.item()


# continent_info = read_excel('Countries')
countries = read_excel('Countries')


def get_continent(country_code):
    region = countries[countries.Code == country_code].Region
    return region.item()


# Energy mix
energy_mix = read_excel('Energy Mix')
energy_mix_updated = energy_mix.copy()
energy_mix_ghg = read_excel('Energy Mix GHG Impacts')
energy_mix_ghg_t = energy_mix_ghg.transpose()

for val in ('expected', 'minimum', 'maximum'):
    ghg = energy_mix_ghg_t.loc[val]
    ghg_cf = (energy_mix.iloc[:, 4:].values * np.tile(ghg, (250, 1))).sum(axis=1)
    energy_mix_updated[f'Impact_CF_{val}'] = ghg_cf


# Select value from the spreadsheet if the user chooses the country
def lookup_val(country):
    # country = convert_country_name(country)
    country = coco.convert(country)

    if country == 'not found':
        return

    val_dct = {
        'Caloric intake': get_country_val('Caloric Intake', country),
        'Animal protein intake': get_country_val('Animal Protein', country),
        'Vegetable protein intake': get_country_val('Vegetal Protein', country),
        'Food waste ratio': get_country_val('Food Waste', country),
        'Price level ratio': get_country_val('Price Level Ratio', country),
        'N fertilizer price': get_country_val('N Fertilizer Price', country),
        'P fertilizer price': get_country_val('P Fertilizer Price', country),
        'K fertilizer price': get_country_val('K Fertilizer Price', country),
        'Liquid petroleum gas price': get_country_val('LPG Price', country),
        'Electricity price': get_country_val('Household Electricity Price', country),
        'Income tax': get_country_val('Tax Rate', country) / 100,
        'Unskilled labor wage': get_country_val('Unskilled Labor Wage', country),
        'Skilled labor wage': get_country_val('Skilled Labor Wage', country),
        'Electricity impact factor': get_country_val(energy_mix_updated, country, val_col='Impact_CF_expected'),
    }

    return val_dct


# =============================================================================
# Prettify things for displaying
# =============================================================================


params_dct = {
    'Caloric intake': '[kcal/d]',
    'Animal protein intake': '[g/d]',
    'Vegetable protein intake': '[g/d]',
    'Food waste ratio': '[%]',
    'Price level ratio': '[-]',
    'N fertilizer price': '[USD/kg N]',
    'P fertilizer price': '[USD/kg P]',
    'K fertilizer price': '[USD/kg K]',
    'Liquid petroleum gas price': '[USD/L]',
    'Electricity price': '[USD/kWh]',
    'Income tax': '[%]',
    'Unskilled labor wage': '[USD/worker/month]',
    'Skilled labor wage': '[USD/worker/month]',
    'Electricity impact factor': 'kg-CO2e/kWh'
}


def get_val_df(country):
    val_dct = lookup_val(country)

    if not val_dct:
        return '', f'No available information for country {country}'

    df = pd.DataFrame({
        'Parameter': val_dct.keys(),
        'Value': val_dct.values(),
        'Unit': params_dct.values(),
    })
    return val_dct, df


if __name__ == '__main__':
    all_json = {}
    countries_df = pd.read_csv(countriesPath, sep='\n', header=None)
    countries_df = countries_df.head(5)
    for _, row in countries_df.iterrows():
        try:
            country = row[0]
            print(country)
            val_dict, val_df = get_val_df(country)
            val_json_unp = val_df.to_json(orient='records')
            print('>> Complete')
            all_json[country] = json.loads(val_json_unp)
        except:  # ValueError or AttributeError
            print('>> Ignored')
            continue

    with open('countries.json', 'w', encoding='utf-8') as f:
        json.dump(all_json, f, ensure_ascii=False, indent=4)

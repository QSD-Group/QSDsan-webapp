#!/usr/bin/env python3
# -*- coding: utf-8 -*-

'''
QSDsan-webapp: Web application for QSDsan

This module is developed by:
    
    Yalin Li <mailto.yalin.li@gmail.com>

This module is under the University of Illinois/NCSA Open Source License.
Please refer to https://github.com/QSD-Group/QSDsan/blob/main/LICENSE.txt
for license details.
'''

import biosteam as bst
from exposan import htl
from biorefineries.cane import create_sugarcane_chemicals

class BoilerTurbogenerator(bst.facilities.BoilerTurbogenerator):

    # Make it work for a system without utility agents
    def _load_utility_agents(self):
        steam_utilities = self.steam_utilities
        steam_utilities.clear()
        agent = self.agent
        units = self.other_units
        if units is not None:
            for agent in (*self.other_agents, agent):
                ID = agent.ID
                for u in units:
                    for hu in u.heat_utilities:
                        agent = hu.agent
                        if agent and agent.ID == ID:
                            steam_utilities.add(hu)
            self.electricity_demand = sum([u.power_utility.consumption for u in units])
        else: self.electricity_demand = 0

def create_chemicals():
    htl_cmps = htl.create_components()
    cane_chems = create_sugarcane_chemicals()
    
    # Components in the feedstock
    Water = htl_cmps.Water
    Lipids = htl_cmps.Sludge_lipid.copy('Lipids')
    Proteins = htl_cmps.Sludge_protein.copy('Proteins')
    Carbohydrates = htl_cmps.Sludge_carbo.copy('Carbohydrates')
    Ash = htl_cmps.Sludge_ash.copy('Ash')
    Cellulose = cane_chems.Cellulose
    Hemicellulose = cane_chems.Hemicellulose
    Lignin = cane_chems.Lignin
    CaO = cane_chems.CaO
    
    P4O10 = cane_chems.P4O10
    O2 = cane_chems.O2
    N2 = cane_chems.N2
    CH4 = cane_chems.CH4
    CO2 = cane_chems.CO2
    
    chems = bst.Chemicals((
        Water, Lipids, Proteins, Carbohydrates, Ash,
        Cellulose, Hemicellulose, Lignin, CaO,
        P4O10, O2, N2, CH4, CO2))
    bst.settings.set_thermo(chems)

    return chems

def create_system():
    chems = create_chemicals()
    feedstock = bst.Stream('feedstock',
                            Water=700,
                            Ash=257,
                            Lipids=204*(1000-700-257),
                            Proteins=463*(1000-700-257),
                            Carbohydrates=(1000-204-463)*(1000-700-257),)
    BT = BoilerTurbogenerator('BT', ins=feedstock)
    sys = bst.System('sys', path=(BT,))
    return sys


# %%

# From the HTL module
compositions = {
    'sludge': (0.7, 0.257, 0.204, 0.463), # moisture, ash, lipid, protein; lipid/protein in ash-free dry weight
    'food': (0.74, 0.0679, 0.22, 0.2),
    'fog': (0.35, 0.01865, 0.987, 0.002), # fats, oils, and grease
    'green': (0.342, 0.134, 0.018, 0.049),
    'manure': (0.6634, 0.3056, 0.092325, 0.216375),
    }



sys = create_system()
emissions = sys.flowsheet.stream.emissions
emissions.imass['CO2'] # CO2 emission

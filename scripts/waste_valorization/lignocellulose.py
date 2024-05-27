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

from biorefineries.cellulosic import Biorefinery as CellulosicEthanol
from biorefineries.cellulosic.streams import cornstover as cornstover_kwargs
from biorefineries.cornstover import ethanol_density_kggal

# Common settings for both biorefineries
#!!! Need to update the composition, etc.
# here's what `cornstover_kwargs` looks like
# cornstover = stream_kwargs(
#     'cornstover',
#     Glucan=0.28,
#     Xylan=0.1562,
#     Galactan=0.001144,
#     Arabinan=0.01904,
#     Mannan=0.0048,
#     Lignin=0.12608,
#     Acetate=0.01448,
#     Protein=0.0248,
#     Extract=0.1172,
#     Ash=0.03944,
#     Sucrose=0.00616,
#     Water=0.2,
#     total_flow=104229.16,
#     units='kg/hr',
#     price=0.05158816935126135,
# )
feedstock_kwargs = cornstover_kwargs.copy()
feedstock_kwargs.update({
    'ID': 'lignocellulose',
    'Glucan': 0.28,
    'total_flow': 1000,
    })


#!!! Needs updating, put the baseline values here, current numbers are placeholders
prices = {
    'lignocellulose': 0.2, # $/kg including water
    'Electricity': 0.07,
    }

GWP_CFs = {
    'lignocellulose': 1.,
    'sulfuric_acid': 1,
    'ammonia': 1,
    'cellulase': 1, #!!! note water content
    'CSL': 1,
    'caustic': 1, #!!! note water content    
    'FGD_lime': 1, #!!! need to be clear if this is CaO or Ca(OH)2
    'Electricity': (1., 1.,), # consumption, production
    }

br = CellulosicEthanol(
    name='ethanol',
    feedstock_kwargs=feedstock_kwargs,
    prices=prices,
    GWP_CFs=GWP_CFs,
    )

sys = br.sys
sys.simulate()
tea = sys.TEA

f = sys.flowsheet
ethanol = f.stream.ethanol

get_MESP = lambda: tea.solve_price(ethanol)*ethanol_density_kggal # from $/kg to $/gallon
get_GWP = lambda: sys.get_net_impact('GWP')/sys.operating_hours/ethanol.F_mass*ethanol_density_kggal

print(f'price: ${get_MESP():.3f}/gal')
print(f'GWP: {get_GWP():.3f} kg CO2e/gal')

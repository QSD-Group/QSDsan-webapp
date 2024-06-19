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
https://github.com/BioSTEAMDevelopmentGroup/Bioindustrial-Park/blob/master/biorefineries/oilcane/webapp_model.py
'''

import warnings
warnings.filterwarnings('ignore')

import biosteam as bst
from biorefineries import oilcane as oc

def create_model():
    bst.Metric.caching = False 
    oc.load('O1')
    model = oc.model
    names = (
        'Bagasse oil retention',
        'Oil extraction efficiency',
        'Plant capacity',
        'Ethanol price',
        'Relative biodiesel price',
        'Natural gas price',
        'Electricity price',
        'Operating days',
        'IRR',
        'Crude glycerol price',
        'Pure glycerol price',
        'Saccharification reaction time',
        'Cellulase price',
        'Cellulase loading',
        'PTRS base cost',
        'Cane glucose yield',
        'Sorghum glucose yield',
        'Cane xylose yield',
        'Sorghum xylose yield',
        'Glucose to ethanol yield',
        'Xylose to ethanol yield',
        'Titer',
        'Productivity',
        'Cane PL content',
        'Sorghum PL content',
        'Cane FFA content',
        'Sorghum FFA content',
        'Cane oil content',
        'Relative sorghum oil content',
        'TAG to FFA conversion',
        'Feedstock GWPCF',
        'Methanol GWPCF',
        'Pure glycerine GWPCF',
        'Cellulase GWPCF',
        'Natural gas GWPCF',
    )
    for name, parameter in zip(names, model.parameters): parameter.name = name
    
    oil_related = {
        'Bagasse oil retention',
        'Oil extraction efficiency',
        'Plant capacity',
        'Ethanol price',
        'Relative biodiesel price',
        'Electricity price',
        'Operating days',
        'IRR',
        'Crude glycerol price',
        'Pure glycerol price',
        'Cane PL content',
        'Cane FFA content',
        'Cane oil content',
        'TAG to FFA conversion',
        'Feedstock GWPCF',
        'Methanol GWPCF',
        'Pure glycerine GWPCF',
    }
    model.parameters = [p for p in model.parameters if p.name in oil_related]
            
    names = (
        (0, 'Maximum feedstock purchase price'),
        (2, None),
        (3, None),
        (4, None),
        (5, None),
        (9, 'Ethanol GWP, economic allocation'),
        (10, 'Biodiesel GWP, economic allocation'),
        (11, 'Crude glycerol GWP, economic allocation'),
        (12, 'Electricity GWP, economic allocation'),
        (13, 'Ethanol GWP, displacement allocation'),
        (15, 'Ethanol GWP, energy allocation'),
        (16, 'Biodiesel GWP, energy allocation'),
        (17, 'Crude glycerol GWP, energy allocation'),
    )
    
    def rename(metric, name):
        if name is not None: metric.name = name
        return metric
    
    model.metrics = [rename(model.metrics[index], name) for index, name in names]
    return model


# %%

if __name__ == '__main__':
    model = create_model()
    df = model.metrics_at_baseline()

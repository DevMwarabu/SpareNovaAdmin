import { API_BASE } from '../api/config';
import React from 'react';
import BusinessUnitList from './BusinessUnits';
import { Store } from 'lucide-react';

const Shops = () => {
    return <BusinessUnitList title="Shops & Merchants" type="shops" icon={Store} color="emerald" />;
};

export default Shops;

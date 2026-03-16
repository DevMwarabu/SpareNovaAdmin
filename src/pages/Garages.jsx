import React from 'react';
import BusinessUnitList from './BusinessUnits';
import { Gavel } from 'lucide-react';

const Garages = () => {
    return <BusinessUnitList title="Garages & Mechanics" type="garages" icon={Gavel} color="purple" />;
};

export default Garages;

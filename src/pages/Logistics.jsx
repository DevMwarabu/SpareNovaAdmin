import React from 'react';
import BusinessUnitList from './BusinessUnits';
import { Truck } from 'lucide-react';

const Logistics = () => {
    return <BusinessUnitList title="Logistics & Delivery" type="partners" icon={Truck} color="orange" />;
};

export default Logistics;

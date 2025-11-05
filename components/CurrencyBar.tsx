"use client";

import { useState, useEffect } from "react";
import { fetchCurrencies, fetchUserDataByCookie } from '@/lib/client-utils';
import { Currency } from "@/lib/model/currency";

export default function CurrencyBar() {
    const [userData, setUserData] = useState(Object);
    const [currencies, setCurrencies] = useState<Currency[]>([]);

    useEffect(() => {
        (async () => {
            const userData = await fetchUserDataByCookie();
            setUserData(userData);
            const currenciesData = await fetchCurrencies();
            setCurrencies(currenciesData);
        })();
    }, []);

    return (
        (userData ?
            <div className="currency-bar theme-color">
                {currencies.map((currency, index) => (
                    <div key={currency.name} className="currency-item">
                        <img src={currency.iconPath} width={24} height={24} alt={currency.name} />
                        {userData?.[currency.name] ?? 0}
                    </div>
                ))}
            </div> : ""
        )
    );
}

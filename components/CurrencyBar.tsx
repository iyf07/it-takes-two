"use client";

import { useState, useEffect } from "react";
import { fetchUserDataByCookie } from '@/lib/client-utils';
import { CURRENCIES } from "@/lib/data/currency";

export default function CurrencyBar() {
    const [userData, setUserData] = useState(Object);

    useEffect(() => {
        (async () => {
            const userData = await fetchUserDataByCookie();
            setUserData(userData);
        })();
    }, []);

    return (
        (userData ?
            <div className="currency-bar theme-color">
                {CURRENCIES.map((currency, index) => (
                    <div key={currency.name} className="currency-item">
                        <img src={currency.iconPath} width={24} height={24} alt={currency.name} />
                        {userData?.[currency.name] ?? 0}
                    </div>
                ))}
            </div> : ""
        )
    );
}

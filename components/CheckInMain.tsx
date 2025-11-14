"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, Row, Col, Image, Button } from 'react-bootstrap';
import { CURRENCIES } from "@/lib/data/currency";
import { fetchUserDataByCookie } from '@/lib/client-utils';
import PopUpWindow from '@/components/PopUpWindow';
import FormWarningBanner from '@/components/FormWarningBanner';

export default function CheckInMain() {
    const [message, setMessage] = useState("");
    const [userData, setUserData] = useState(Object);
    const [checkedIn, setCheckedIn] = useState(Boolean);
    const [popupMsg, setPopUpMsg] = useState<string | null>(null);
    const [currencyChanges, setCurrencyChanges] = useState<Map<string, number>>(new Map());
    const [locationRedir, setLocationRedir] = useState<string | undefined>(undefined);
    const utcDate = new Date();
    const etString = utcDate.toLocaleString("en-US", {
        timeZone: "America/New_York",
    });
    const etDate = new Date(etString);

    async function handleCheckIn() {
        let probabilityMap = new Map<string, number[]>;
        let min = 0;
        let max = 0;
        let winner = "";
        for (const currency of CURRENCIES) {
            let newMax = max + 1 + Math.floor(100 / currency.value);
            probabilityMap.set(currency.name, [max + 1, newMax])
            max = newMax;
        }
        const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;;
        for (const [key, value] of probabilityMap) {
            if (randomNumber >= value[0] && randomNumber < value[1]) {
                winner = key;
                setPopUpMsg(`Successfully checked in.`)
                const newCurrencyChanges = new Map();
                newCurrencyChanges.set(CURRENCIES.find(c => c.name === winner)?.iconPath, 1);
                setCurrencyChanges(newCurrencyChanges);
                setLocationRedir(`/check-in`)
                break;
            }
        }
        await fetch(`/api/user/${userData._id}`, {
            method: "PUT",
            body: JSON.stringify({
                lastCheckedIn: etDate.toISOString(),
                price: 1,
                currency: winner,
            }),
            credentials: "include",
        });
    }

    useEffect(() => {
        (async () => {
            const userData = await fetchUserDataByCookie();
            setUserData(userData);
            if (userData && userData.lastCheckedIn) {
                const lastCheckedInDate = new Date(userData.lastCheckedIn.toLocaleString("en-US", {
                    timeZone: "America/New_York",
                }));
                if (lastCheckedInDate.getMonth() === etDate.getMonth() && lastCheckedInDate.getDate() === etDate.getDate()) {
                    setCheckedIn(true);
                    setMessage("You have successfully checked in");
                } else {
                    setCheckedIn(false);
                }
            }
        })();
    }, []);

    return (
        <Card className="p-4 shadow form">
            {popupMsg && <PopUpWindow message={popupMsg} locationRedir={locationRedir} currencyChanges={currencyChanges}/>}
            <FormWarningBanner message={message} />
            <Card.Header className="text-center bg-white border-0">
                <h2 className="fw-bold"><Image src="/icons/Pumpkin.png" width={24} height={24} /> Check-in</h2>
            </Card.Header>
            <Card.Body>
                <Row className="justify-content-center text-center">
                    {CURRENCIES.map((currency, index) =>
                        (<Col key={index} xs={4} md={4} className="mb-3"> <Image src={currency.iconPath} thumbnail /></Col>))} </Row>
                <Button type="submit" className="w-100 theme-color" onClick={e => handleCheckIn()}> Check in</Button>
            </Card.Body>
        </Card>)
}

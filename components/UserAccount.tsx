"use client";

import { useState, useEffect } from "react";
import { Card, ListGroup, ListGroupItem, ProgressBar } from 'react-bootstrap';
import FormWarningBanner from '@/components/FormWarningBanner';
import { fetchUserDataByCookie, fetchUserDataById } from '@/lib/client-utils';
import { CURRENCIES } from "@/lib/data/currency";

function getLevelIcons(lv: number) {
    if(lv >= 24){
        return ["L8", "S3"]
    } else {
        const res = [];
        const quotient = Math.floor(lv / 4);
        res.push(`L${quotient+1}`);
        const remainder = lv % 4;
        if(remainder != 0){
            res.push(`S${remainder}`);
        }
        return res;
    }
}

export default function UserAccount() {
    const [error, setError] = useState("");
    const [userData, setUserData] = useState(Object);
    const [level, setLevel] = useState(1);
    const [xpToNext, setXpToNext] = useState(0);
    const [partnerData, setPartnerData] = useState(Object);

    useEffect(() => {
        (async () => {
            const userData = await fetchUserDataByCookie();
            if (userData) {
                setUserData(userData);
                if (userData.partnerId) {
                    const partnerData = await fetchUserDataById(userData.partnerId);
                    setPartnerData(partnerData);
                }
            } else {
                setError("Please sign in or sign up")
            }

            let lv = 0;
            while (true) {
                if ((userData.xp ?? 0)< Math.pow(lv + 1, 1.2)) {
                    setLevel(lv);
                    setXpToNext(Math.floor(50 * Math.pow(lv + 1, 1.2)));
                    break;
                }
                lv ++;
            };
        })();
    }, []);

    return (
        <Card className="p-4 shadow form">
            <FormWarningBanner error={error} />
            <Card.Header className="text-center bg-white border-0">
                <h2 className="fw-bold">Account</h2>
            </Card.Header>
            <Card.Body>
                <Card.Title className="mb-3">Username: {userData.username}</Card.Title>
                <Card.Subtitle className="mb-3">LV: 
                    {getLevelIcons(level).map((name, index) => (
                        <img src={`/icons/${name}.png`} width={24} height={24} alt={name} key={index}/>
                    ))}<ProgressBar animated variant="warning" now={userData.xp ?? 0} label={`${userData.xp ?? 0}/${xpToNext}`}/></Card.Subtitle>
                <Card.Subtitle className="mb-3 text-muted">ID: {userData._id}</Card.Subtitle>
                <Card.Body>
                    <ListGroup variant="flush">
                        {CURRENCIES.map((currency, index) => (
                            <ListGroupItem key={currency.name} className="d-flex gap-2 mb-2">
                                <img src={currency.iconPath} width={24} height={24} alt={currency.name} />
                                <span>{currency.name}: {userData?.[currency.name] ?? 0}</span>
                            </ListGroupItem>
                        ))}
                    </ListGroup>
                </Card.Body>
            </Card.Body>
            <Card.Footer>
                <p className="mb-3">Partner: {partnerData.username}</p>
                <p className="mb-3 text-muted">ID: {partnerData._id}</p>
            </Card.Footer>
        </Card>
    );
}

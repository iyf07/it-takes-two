"use client";

import { useState, useEffect } from "react";
import { Card, ListGroup, ListGroupItem } from 'react-bootstrap';
import FormWarningBanner from '@/components/FormWarningBanner';
import { fetchUserDataByCookie, fetchUserDataById } from '@/lib/client-utils';
import { CURRENCIES } from "@/lib/data/currency";

export default function UserAccount() {
    const [error, setError] = useState("");
    const [userData, setUserData] = useState(Object);
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
            }else{
                setError("Please sign in or sign up")
            }
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
                <Card.Subtitle className="mb-3 text-muted">ID: {userData._id}</Card.Subtitle>
                <Card.Subtitle className="mb-3">Partner: {partnerData.username}</Card.Subtitle>
                <Card.Subtitle className="mb-3 text-muted">ID: {partnerData._id}</Card.Subtitle>
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
        </Card>
    );
}

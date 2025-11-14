"use client";

import { useState, useEffect } from "react";
import { Form, Card, Button, Image } from 'react-bootstrap';
import FormWarningBanner from '@/components/FormWarningBanner';
import PopUpWindow from '@/components/PopUpWindow';
import { fetchUserDataByCookie } from '@/lib/client-utils';
import { CURRENCIES } from "@/lib/data/currency";

export default function GiftSend() {
    const [error, setError] = useState("");
    const [popupMsg, setPopUpMsg] = useState<string | null>(null);
    const [locationRedir, setLocationRedir] = useState<string | undefined>(undefined);
    const [userData, setUserData] = useState(Object);
    const [gift, setGift] = useState(Object);

    useEffect(() => {
        (async () => {
            const userData = await fetchUserDataByCookie();
            setUserData(userData);
        })();
    }, []);

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const currency = gift.currency ?? CURRENCIES[0].name;

        const sendRes = await fetch(`/api/user/${userData._id}`, {
            method: "PUT",
            body: JSON.stringify({
                price: Number(gift.price) * -1,
                currency: currency,
            }),
            credentials: "include",
        });
        if (!sendRes.ok) {
            setError(`Insufficient ${currency}`);
            return;
        }
        await fetch(`/api/user/${userData.partnerId}`, {
            method: "PUT",
            body: JSON.stringify({
                price: Number(gift.price),
                currency: currency,
            }),
            credentials: "include",
        });

        const res = await fetch(`/api/gift`, {
            method: "POST",
            body: JSON.stringify({
                receiverId: userData.partnerId,
                senderId: userData._id,
                name: gift.name,
                price: gift.price,
                currency: currency,
                note: gift.note
            }),
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        });
        if (res.ok) {
            setPopUpMsg(`Successfully sent ${gift.price} ${currency}`);
            setLocationRedir("/gift");
        }
    }

    return (
        <Card className="p-4 shadow form">
            {popupMsg && <PopUpWindow message={popupMsg} locationRedir={locationRedir} />}
            <FormWarningBanner error={error} />
            <Card.Header className="text-center bg-white border-0">
                <h2 className="fw-bold"><Image src="/icons/Fairy_Rose.png" width={24} height={24} />Send Gift</h2>
            </Card.Header>
            <Card.Body>
                <Form onSubmit={onSubmit}>
                    <Form.Group className="mb-3" controlId="name">
                        <Form.Label>Name</Form.Label>
                        <Form.Control required type="text" name="name" placeholder="Enter gift name" onChange={(e) => setGift({ ...gift, name: e.target.value })} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="currency">
                        <Form.Label>Currency <img src={gift.currency ? CURRENCIES.find(c => c.name === gift.currency)?.iconPath : CURRENCIES[0]?.iconPath} width={24} height={24} alt={String(gift.currency)} /></Form.Label>
                        <Form.Select defaultValue={CURRENCIES[0]?.name} onChange={(e) => setGift({ ...gift, currency: e.target.value })}>
                            {CURRENCIES.map((currency, index) => (
                                <option value={currency.name}>{currency.name.toUpperCase()}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="price">
                        <Form.Label>Price</Form.Label>
                        <Form.Control required type="number" name="price" placeholder="Enter price" onChange={(e) => setGift({ ...gift, price: e.target.value })} />
                    </Form.Group>
                    <Form.Group className="mb-4" controlId="note">
                        <Form.Label>Note</Form.Label>
                        <Form.Control required type="string" name="note" placeholder="Enter note" onChange={(e) => setGift({ ...gift, note: e.target.value })} />
                    </Form.Group>
                    <Button type="submit" className="w-100 theme-color">
                        Send
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    );
}
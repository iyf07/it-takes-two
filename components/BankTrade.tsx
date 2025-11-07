"use client";

import { useState, useEffect } from "react";
import { Form, Card, Button } from 'react-bootstrap';
import FormWarningBanner from '@/components/FormWarningBanner';
import { CURRENCIES } from "@/lib/data/currency";
import { fetchUserDataByCookie } from '@/lib/client-utils';

export default function BankTrade({ currency }: { currency: string }) {
    const [error, setError] = useState("");
    const [userData, setUserData] = useState(Object);
    const [from, setFrom] = useState(CURRENCIES[0]?.name);
    const [amount, setAmount] = useState(1);
    const [toAmount, setToAmount] = useState(0);
    const [fromAmount, setFromAmount] = useState(0);

    function calculateFromToAmount(amount: number, fromCurrency: string, toCurrency: string) {
        const fromCurrencyValue = CURRENCIES.find(c => c.name === fromCurrency)!.value;
        const toCurrencyValue = CURRENCIES.find(c => c.name === toCurrency)!.value;
        const newToAmount = Math.floor(amount * fromCurrencyValue / toCurrencyValue);
        const newFromAmount = fromCurrencyValue > toCurrencyValue ? amount : newToAmount * toCurrencyValue;
        setAmount(amount);
        setFrom(fromCurrency);
        setFromAmount(newFromAmount);
        setToAmount(newToAmount);
    }

    async function handleChangeFrom(e: React.ChangeEvent<HTMLSelectElement>) {
        e.preventDefault();
        const newCurrency = e.target.value;
        calculateFromToAmount(1, newCurrency, currency)
        setAmount(1);
    }

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        await fetch(`/api/user/${userData._id}`, {
            method: "PUT",
            body: JSON.stringify({
                price: Number(fromAmount) * -1,
                currency: from,
            }),
            credentials: "include",
        });
        await fetch(`/api/user/${userData._id}`, {
            method: "PUT",
            body: JSON.stringify({
                price: Number(toAmount),
                currency: currency,
            }),
            credentials: "include",
        });

        location.href = "/bank";
    }

    useEffect(() => {
        (async () => {
            const userData = await fetchUserDataByCookie();
            setUserData(userData);
            calculateFromToAmount(1, CURRENCIES[0]?.name, currency);
        })();
    }, []);
    return (
        <Card className="p-4 shadow form">
            <FormWarningBanner error={error} />
            <Card.Header className="text-center bg-white border-0">
                <h2 className="fw-bold">Trade {currency}</h2>
            </Card.Header>
            <Card.Body>
                <Form onSubmit={onSubmit}>
                    <Form.Group className="mb-3" controlId="category">
                        <Form.Label>From</Form.Label>
                        <Form.Select defaultValue={CURRENCIES[0]?.name} onChange={handleChangeFrom}>
                            {CURRENCIES.map((currency, index) => (
                                <option value={currency.name} key={index}>{currency.name.toUpperCase()}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="amount">
                        <div className="d-flex justify-content-between">
                            <Form.Label>Amount</Form.Label>
                            <span className="text-muted"><img src={CURRENCIES.find(c => c.name === from)?.iconPath} width={24} height={24} alt={String(currency)} /> {amount}</span>
                        </div>
                        <Form.Range min={1} max={100} value={amount} onChange={e => calculateFromToAmount(Number(e.target.value), from, currency)} />
                    </Form.Group>
                    <div className="d-flex justify-content-between">
                        <Form.Label>To</Form.Label>
                        <span className="text-muted"><img src={CURRENCIES.find(c => c.name === currency)?.iconPath} width={24} height={24} alt={String(currency)} /> {toAmount}</span>
                    </div>
                    <Button type="submit" className="w-100 theme-color">
                        Submit
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    );
}

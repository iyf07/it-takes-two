"use client";

import { Card, Row, Col, Image } from 'react-bootstrap';
import { CURRENCIES } from "@/lib/data/currency";

export default function BankMain() {
    return (
        <Card className="p-4 shadow form">
            <Card.Header className="text-center bg-white border-0">
                <h2 className="fw-bold">Bank</h2>
            </Card.Header>
            <Card.Body>
                <Row className="justify-content-center text-center">
                    {CURRENCIES.map((currency, index) => (
                        <Col key={index} xs={4} md={4} className="mb-3">
                            <a href={`/bank/trade/${currency.name}`}>
                                <Image src={currency.iconPath} thumbnail/>
                            </a>
                            <div className="mt-2">{currency.name.toUpperCase()}</div>
                        </Col>
                    ))}
                </Row>
            </Card.Body>
        </Card>
    );
}

"use client";

import { useState, useEffect } from "react";
import { Accordion, Card, ListGroup, ListGroupItem, Button, Image } from 'react-bootstrap';
import { fetchUserDataByCookie, fetchGiftsByUserIdType, isoToDate } from '@/lib/client-utils';
import { Gift } from "@/lib/model/gift";
import { CURRENCIES } from "@/lib/data/currency";

export default function GiftMain() {
    const [userData, setUserData] = useState(Object);
    const [receivedGifts, setReceivedGifts] = useState<Gift[]>([]);
    const [sentGifts, setSentGifts] = useState<Gift[]>([]);

    useEffect(() => {
        (async () => {
            const userData = await fetchUserDataByCookie();
            setUserData(userData);
            const receivedGiftsData = await fetchGiftsByUserIdType(userData._id, "receiver");
            setReceivedGifts(receivedGiftsData);
            const sentGiftsData = await fetchGiftsByUserIdType(userData._id, "sender");
            setSentGifts(sentGiftsData);
        })();
    }, []);

    return (
        <Card className="p-4 shadow form card-scroll">
            <Card.Header className="text-center bg-white border-0">
                <h2 className="fw-bold"><Image src="/icons/Fairy_Rose.png" width={24} height={24} />Gift Shop</h2>
            </Card.Header>
            <Card.Title className="mb-3 text-center">Received gifts</Card.Title>
            <Card.Body className="card-scroll-body">
                <Accordion>
                    {receivedGifts.map((gift, index) => {
                        const currency = CURRENCIES.find(c => c.name === gift?.currency);
                        return (<Accordion.Item eventKey={String(index)} key={gift.note}>
                            <Accordion.Header>{gift.name}</Accordion.Header>
                            <Accordion.Body>
                                <ListGroup variant="flush">
                                    <ListGroupItem key="price" className="d-flex gap-2 mb-2">
                                        Gift: <img src={currency?.iconPath} width={24} height={24} alt={String(index)} />{gift.price}
                                    </ListGroupItem>
                                    <ListGroupItem key="date" className="d-flex gap-2 mb-2">
                                        Date: {isoToDate(gift.date)}
                                    </ListGroupItem>
                                    <ListGroupItem key="description" className="d-flex gap-2 mb-2">
                                        Note: {gift.note}
                                    </ListGroupItem>
                                </ListGroup>
                            </Accordion.Body>
                        </Accordion.Item>
                        )
                    })}
                </Accordion>
            </Card.Body>
            <Card.Title className="mb-3 text-center">Sent gifts</Card.Title>
            <Card.Body className="card-scroll-body">
                <Accordion>
                    {sentGifts.map((gift, index) => {
                        const currency = CURRENCIES.find(c => c.name === gift?.currency);
                        return (<Accordion.Item eventKey={String(index)} key={gift.note}>
                            <Accordion.Header>{gift.name}</Accordion.Header>
                            <Accordion.Body>
                                <ListGroup variant="flush">
                                    <ListGroupItem key="price" className="d-flex gap-2 mb-2">
                                        Gift: <img src={currency?.iconPath} width={24} height={24} alt={String(index)} />{gift.price}
                                    </ListGroupItem>
                                    <ListGroupItem key="date" className="d-flex gap-2 mb-2">
                                        Date: {isoToDate(gift.date)}
                                    </ListGroupItem>
                                    <ListGroupItem key="description" className="d-flex gap-2 mb-2">
                                        Note: {gift.note}
                                    </ListGroupItem>
                                </ListGroup>
                            </Accordion.Body>
                        </Accordion.Item>
                        )
                    })}
                </Accordion>
                <Button href={`/gift/send`} className="mt-3 mx-auto w-100 theme-color button">
                    Send gift
                </Button>
            </Card.Body>
        </Card>
    );
}

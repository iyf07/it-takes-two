"use client";

import { useState, useEffect } from "react";
import { Accordion, Card, ListGroup, ListGroupItem, Button } from 'react-bootstrap';
import { fetchUserDataByCookie, fetchUserDataById, fetchServicesByUserId } from '@/lib/client-utils';
import { Service } from "@/lib/model/service";
import { CURRENCIES } from "@/lib/data/currency";

export default function ServiceMain() {
    const [userData, setUserData] = useState(Object);
    const [services, setServices] = useState<Service[]>([]);
    const [partnerServices, setPartnerServices] = useState<Service[]>([]);

    async function handleOrder(serviceId: string, userId: string, price: Number | undefined, currency: string | undefined) {
        await fetch(`/api/order`, {
            method: "POST",
            body: JSON.stringify({
                serviceId: serviceId,
                userId: userId
            }),
            credentials: "include",
        });

        await fetch(`/api/user/${userId}`, {
            method: "PUT",
            body: JSON.stringify({
                price: Number(price) * -1,
                currency: currency,
            }),
            credentials: "include",
        });

        location.href = "/order";
    }

    useEffect(() => {
        (async () => {
            const userData = await fetchUserDataByCookie();
            setUserData(userData);
            const servicesData = await fetchServicesByUserId(userData._id);
            setServices(servicesData);

            const partnerData = await fetchUserDataById(userData.partnerId);
            const partnerServicesData = await fetchServicesByUserId(partnerData._id);
            setPartnerServices(partnerServicesData);
        })();
    }, []);

    return (
        <Card className="p-4 shadow form card">
            <Card.Header className="text-center bg-white border-0">
                <h2 className="fw-bold">Store</h2>
            </Card.Header>
            <Card.Title className="mb-3 text-center">Partner services</Card.Title>
            <Card.Body>
                <Accordion>
                    {partnerServices.map((service, index) => {
                        const currency = CURRENCIES.find(c => c.category === service?.category);
                        return (<Accordion.Item eventKey={String(index)} key={service.name}>
                            <Accordion.Header>
                                <span className="d-flex align-items-center gap-1">
                                    <img src={currency?.iconPath} width={24} height={24} alt={String(index)} />{service.name}
                                </span>
                                </Accordion.Header>
                            <Accordion.Body>
                                <ListGroup variant="flush">
                                    <ListGroupItem key="price" className="d-flex gap-2 mb-2">
                                        Price: <img src={currency?.iconPath} width={24} height={24} alt={String(index)} />{service.price}
                                    </ListGroupItem>
                                    <ListGroupItem key="description" className="d-flex gap-2 mb-2">
                                        Description: {service.description}
                                    </ListGroupItem>
                                    <ListGroupItem key="category" className="d-flex gap-2 mb-2">
                                        Category: {currency?.category}
                                    </ListGroupItem>
                                    <Button onClick={() => handleOrder(service._id, userData._id, service?.price, currency?.name)} className="theme-color">
                                        Order
                                    </Button>
                                </ListGroup>
                            </Accordion.Body>
                        </Accordion.Item>
                        )
                    })}
                </Accordion>
            </Card.Body>

            <Card.Body>
                <Card.Title className="mb-3 text-center">Your services</Card.Title>
                <Accordion>
                    {services.map((service, index) => {
                        const currency = CURRENCIES.find(c => c.category === service?.category);
                        return (<Accordion.Item eventKey={String(index)} key={service.name}>
                            <Accordion.Header>
                                <span className="d-flex align-items-center gap-1">
                                    <img src={currency?.iconPath} width={24} height={24} alt={String(index)} />{service.name}
                                </span>
                                </Accordion.Header>
                            <Accordion.Body>
                                <ListGroup variant="flush">
                                    <ListGroupItem key="price" className="d-flex gap-2 mb-2">
                                        Price: <img src={currency?.iconPath} width={24} height={24} alt={String(index)} />{service.price}
                                    </ListGroupItem>
                                    <ListGroupItem key="description" className="d-flex gap-2 mb-2">
                                        Description: {service.description}
                                    </ListGroupItem>

                                    <ListGroupItem key="category" className="d-flex gap-2 mb-2">
                                        Category: {currency?.category}
                                    </ListGroupItem>
                                    <Button href={`/service/update/${service._id}`} className="mb-3 theme-color">
                                        Update
                                    </Button>
                                    <Button href={`/service/delete`} className="bg-danger">
                                        Delete
                                    </Button>
                                </ListGroup>
                            </Accordion.Body>
                        </Accordion.Item>
                        )
                    })}
                    <Button href={`/service/create`} className="mt-3 w-100 theme-color button">
                        create
                    </Button>
                </Accordion>
            </Card.Body>
        </Card>
    );
}

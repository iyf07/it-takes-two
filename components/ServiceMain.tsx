"use client";

import { useState, useEffect } from "react";
import { Accordion, Card, ListGroup, ListGroupItem, Button } from 'react-bootstrap';
import { fetchCurrencies, fetchUserDataByCookie, fetchUserDataById, fetchServicesByUserId } from '@/lib/client-utils';
import { Service } from "@/lib/model/service";
import { Currency } from "@/lib/model/currency";

export default function Account() {
    const [currencies, setCurrencies] = useState<Currency[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [partnerServices, setPartnerServices] = useState<Service[]>([]);

    useEffect(() => {
        (async () => {
            const userData = await fetchUserDataByCookie();
            const servicesData = await fetchServicesByUserId(userData._id);
            setServices(servicesData);

            const partnerData = await fetchUserDataById(userData.partnerId);
            const partnerServicesData = await fetchServicesByUserId(partnerData._id);
            setPartnerServices(partnerServicesData);

            const currenciesData = await fetchCurrencies();
            setCurrencies(currenciesData);
        })();
    }, []);

    return (
        <Card className="p-4 shadow form">
            <Card.Header className="text-center bg-white border-0">
                <h2 className="fw-bold">Store</h2>
            </Card.Header>
            <Card.Body>
                <Card.Title className="mb-3 text-center">Partner services</Card.Title>
                <Card.Body>
                    <Accordion>
                        {partnerServices.map((service, index) => (
                            <Accordion.Item eventKey={String(index)} key={service.name} className="mb-3">
                                <Accordion.Header>{service.name} </Accordion.Header>
                                <Accordion.Body>
                                    <ListGroup variant="flush">
                                        <ListGroupItem key="price" className="d-flex gap-2 mb-2">
                                            Price: <img src={currencies.find(c => c.category === service.category)?.iconPath} width={24} height={24} alt={String(index)} />{service.price}
                                        </ListGroupItem>
                                        <ListGroupItem key="description" className="d-flex gap-2 mb-2">
                                            Description: {service.description}
                                        </ListGroupItem>
                                        <ListGroupItem key="category" className="d-flex gap-2 mb-2">
                                            Category: {currencies.find(c => c.category === service.category)?.category}
                                        </ListGroupItem>
                                    </ListGroup>
                                </Accordion.Body>
                            </Accordion.Item> 
                        ))}
                    </Accordion>
                </Card.Body>
            </Card.Body>

            <Card.Body>
                <Card.Title className="mb-3 text-center">Your services</Card.Title>
                <Card.Body>
                    <Accordion>
                        {services.map((service, index) => (
                            <Accordion.Item eventKey={String(index)} key={service.name} className="mb-3">
                                <Accordion.Header>{service.name} </Accordion.Header>
                                <Accordion.Body>
                                    <ListGroup variant="flush">
                                        <ListGroupItem key="price" className="d-flex gap-2 mb-2">
                                            Price: <img src={currencies.find(c => c.category === service.category)?.iconPath} width={24} height={24} alt={String(index)} />{service.price}
                                        </ListGroupItem>
                                        <ListGroupItem key="description" className="d-flex gap-2 mb-2">
                                            Description: {service.description}
                                        </ListGroupItem>

                                        <ListGroupItem key="category" className="d-flex gap-2 mb-2">
                                            Category: {currencies.find(c => c.category === service.category)?.category}
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
                            
                        ))}
                        <Button href={`/service/update`} className="w-100 theme-color">
                            create
                        </Button>
                    </Accordion>
                </Card.Body>
            </Card.Body>
        </Card>
    );
}

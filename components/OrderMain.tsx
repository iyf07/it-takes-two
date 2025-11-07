"use client";

import { useState, useEffect } from "react";
import { Accordion, Card, ListGroup, ListGroupItem, Button } from 'react-bootstrap';
import { fetchUserDataByCookie, fetchUserDataById, fetchServicesByUserId, fetchOrdersByUserId, isoToDate } from '@/lib/client-utils';
import { Service } from "@/lib/model/service";
import { CURRENCIES } from "@/lib/data/currency";
import { Order } from "@/lib/model/order";

export default function OrderMain() {
    const [services, setServices] = useState<Service[]>([]);
    const [userData, setUserData] = useState(Object);
    const [partnerServices, setPartnerServices] = useState<Service[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [partnerOrders, setPartnerOrders] = useState<Order[]>([]);

    async function handleDeliver(id: string, userId: string, price: number | undefined, currency: string | undefined) {
        await fetch(`/api/order/${id}`, {
            method: "PUT",
            credentials: "include",
        });

        await fetch(`/api/user/${userId}`, {
            method: "PUT",
            body: JSON.stringify({
                price: Number(price),
                currency: currency,
            }),
            credentials: "include",
        });

        location.href = "/order";
    }
    async function handleCancel(id: string, userId: string, price: number | undefined, currency: string | undefined) {
        await fetch(`/api/order/${id}`, {
            method: "DELETE",
            credentials: "include",
        });

        await fetch(`/api/user/${userId}`, {
            method: "PUT",
            body: JSON.stringify({
                price: Number(price),
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
            const ordersData = await fetchOrdersByUserId(userData._id);
            setOrders(ordersData);

            const partnerData = await fetchUserDataById(userData.partnerId);
            const partnerServicesData = await fetchServicesByUserId(partnerData._id);
            setPartnerServices(partnerServicesData);
            const partnerOrdersData = await fetchOrdersByUserId(partnerData._id);
            setPartnerOrders(partnerOrdersData);
        })();
    }, []);

    return (
        <Card className="p-4 shadow form card">
            <Card.Header className="text-center bg-white border-0">
                <h2 className="fw-bold">Orders</h2>
            </Card.Header>
            <Card.Title className="mb-3 text-center">Partner Orders</Card.Title>
            <Card.Body>
                <Accordion>
                    {partnerOrders.map((partnerOrder, index) => {
                        const service = services.find(s => s._id === partnerOrder.serviceId);
                        const currency = CURRENCIES.find(c => c.category === service?.category);
                        const date = isoToDate(partnerOrder.date);
                        const status = partnerOrder?.status ? "Completed" : "Not started";
                        return (<Accordion.Item eventKey={String(index)} key={service?.name}>
                            <Accordion.Header>{service?.name} - {status}</Accordion.Header>
                            <Accordion.Body>
                                <ListGroup variant="flush">
                                    <ListGroupItem key="status" className="d-flex gap-2 mb-2">
                                        Status: {status}
                                    </ListGroupItem>
                                    <ListGroupItem key="date" className="d-flex gap-2 mb-2">
                                        Date: {date}
                                    </ListGroupItem>
                                    <ListGroupItem key="price" className="d-flex gap-2 mb-2">
                                        Price: <img src={currency?.iconPath} width={24} height={24} alt={String(index)} />{service?.price}
                                    </ListGroupItem>
                                    <ListGroupItem key="description" className="d-flex gap-2 mb-2">
                                        Description: {service?.description}
                                    </ListGroupItem>
                                    <ListGroupItem key="category" className="d-flex gap-2 mb-2">
                                        Category: {currency?.category}
                                    </ListGroupItem>
                                    {partnerOrder?.status ? <></> : <Button onClick={() => handleDeliver(partnerOrder._id, userData._id, service?.price, currency?.name)} className="mx-auto theme-color">
                                        Deliver
                                    </Button>}
                                </ListGroup>
                            </Accordion.Body>
                        </Accordion.Item>
                        )
                    })}
                </Accordion>
            </Card.Body>

            <Card.Body>
                <Card.Title className="mb-3 text-center">Your orders</Card.Title>
                <Accordion>
                    {orders.map((order, index) => {
                        const service = partnerServices.find(s => s._id === order.serviceId);
                        const currency = CURRENCIES.find(c => c.category === service?.category);
                        const date = isoToDate(order.date);
                        const status = order?.status ? "Completed" : "Not started";
                        return (<Accordion.Item eventKey={String(index)} key={service?.name}>
                            <Accordion.Header>{service?.name} - {status}</Accordion.Header>
                            <Accordion.Body>
                                <ListGroup variant="flush">
                                    <ListGroupItem key="status" className="d-flex gap-2 mb-2">
                                        Status: {status}
                                    </ListGroupItem>
                                    <ListGroupItem key="date" className="d-flex gap-2 mb-2">
                                        Date: {date}
                                    </ListGroupItem>
                                    <ListGroupItem key="price" className="d-flex gap-2 mb-2">
                                        Price: <img src={currency?.iconPath} width={24} height={24} alt={String(index)} />{service?.price}
                                    </ListGroupItem>
                                    <ListGroupItem key="description" className="d-flex gap-2 mb-2">
                                        Description: {service?.description}
                                    </ListGroupItem>
                                    <ListGroupItem key="category" className="d-flex gap-2 mb-2">
                                        Category: {currency?.category}
                                    </ListGroupItem>
                                    {order?.status ? <></> : (<Button onClick={() => handleCancel(order._id, userData._id, service?.price, currency?.name)} className="mx-auto bg-danger">
                                        Cancel
                                    </Button>)}
                                </ListGroup>
                            </Accordion.Body>
                        </Accordion.Item>
                        )
                    })}
                </Accordion>
            </Card.Body>
        </Card>
    );
}
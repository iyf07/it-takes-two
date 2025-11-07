"use client";

import { useState, useEffect } from "react";
import { Accordion, Card, ListGroup, ListGroupItem, Button } from 'react-bootstrap';
import { fetchUserDataByCookie, fetchUserDataById, fetchServicesByUserId, fetchOrdersByUserId, fetchTasksByUserIds, isoToDate, fetchRecordsByUserId } from '@/lib/client-utils';
import { Service } from "@/lib/model/service";
import { CURRENCIES } from "@/lib/data/currency";
import { Record } from "@/lib/model/record";
import { Task } from "@/lib/model/task";

export default function RecordMain() {
    const [services, setServices] = useState<Service[]>([]);
    const [userData, setUserData] = useState(Object);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [records, setRecords] = useState<Record[]>([]);
    const [partnerRecords, setPartnerRecords] = useState<Record[]>([]);

    async function handleApprove(id: string, userId: string, price: number | undefined, currency: string | undefined) {
        await fetch(`/api/record/${id}`, {
            method: "PUT",
            body: JSON.stringify({
                status: "Approved"
            }),
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

        location.href = "/record";
    }

    async function handleReject(id: string, userId: string, price: number | undefined, currency: string | undefined) {
        await fetch(`/api/record/${id}`, {
            method: "PUT",
            body: JSON.stringify({
                status: "Rejected"
            }),
            credentials: "include",
        });

        location.href = "/record";
    }
    async function handleCancel(id: string) {
        await fetch(`/api/record/${id}`, {
            method: "DELETE",
            credentials: "include",
        });

        location.href = "/record";
    }
    useEffect(() => {
        (async () => {
            const userData = await fetchUserDataByCookie();
            setUserData(userData);
            const tasksData = await fetchTasksByUserIds(userData._id, userData.partnerId);
            setTasks(tasksData);
            const recordsData = await fetchRecordsByUserId(userData._id);
            setRecords(recordsData);
            const partnerRecordsData = await fetchRecordsByUserId(userData.partnerId);
            setPartnerRecords(partnerRecordsData);
        })();
    }, []);

    return (
        <Card className="p-4 shadow form card">
            <Card.Header className="text-center bg-white border-0">
                <h2 className="fw-bold">Diary</h2>
            </Card.Header>
            <Card.Title className="text-center">Partner Diary</Card.Title>
            <Card.Body>
                <Accordion>
                    {partnerRecords.map((partnerRecord, index) => {
                        const task = tasks.find(s => s._id === partnerRecord.taskId);
                        const currency = CURRENCIES.find(c => c.category === task?.category);
                        const date = isoToDate(partnerRecord.date);
                        return (<Accordion.Item eventKey={String(index)} key={partnerRecord.date}>
                            <Accordion.Header className="theme-color">{task?.name} - {partnerRecord?.status}</Accordion.Header>
                            <Accordion.Body>
                                <ListGroup variant="flush">
                                    <ListGroupItem key="status" className="d-flex gap-2 mb-2">
                                        Status: {partnerRecord?.status}
                                    </ListGroupItem>
                                    <ListGroupItem key="date" className="d-flex gap-2 mb-2">
                                        Date: {date}
                                    </ListGroupItem>
                                    <ListGroupItem key="price" className="d-flex gap-2 mb-2">
                                        Price: <img src={currency?.iconPath} width={24} height={24} alt={String(index)} />{task?.price}
                                    </ListGroupItem>
                                    <ListGroupItem key="description" className="d-flex gap-2 mb-2">
                                        Description: {task?.description}
                                    </ListGroupItem>
                                    <ListGroupItem key="category" className="d-flex gap-2 mb-2">
                                        Category: {currency?.category}
                                    </ListGroupItem>
                                    {partnerRecord?.status.toLowerCase() === "pending" ? <><Button onClick={() => handleApprove(partnerRecord._id, userData.partnerId, task?.price, currency?.name)} className="mx-auto theme-color mb-3">
                                        Approve
                                    </Button>
                                        <Button onClick={() => handleReject(partnerRecord._id, userData.partnerId, task?.price, currency?.name)} className="mx-auto bg-danger">
                                            Reject
                                        </Button></> : <></>}
                                </ListGroup>
                            </Accordion.Body>
                        </Accordion.Item>
                        )
                    })}
                </Accordion>
            </Card.Body>

            <Card.Title className="text-center">Your Diary</Card.Title>
            <Card.Body>
                <Accordion>
                    {records.map((record, index) => {
                        const task = tasks.find(s => s._id === record.taskId);
                        const currency = CURRENCIES.find(c => c.category === task?.category);
                        const date = isoToDate(record.date);
                        return (<Accordion.Item eventKey={String(index)} key={record.date}>
                            <Accordion.Header>{task?.name} - {record?.status}</Accordion.Header>
                            <Accordion.Body>
                                <ListGroup variant="flush">
                                    <ListGroupItem key="status" className="d-flex gap-2 mb-2">
                                        Status: {record?.status}
                                    </ListGroupItem>
                                    <ListGroupItem key="date" className="d-flex gap-2 mb-2">
                                        Date: {date}
                                    </ListGroupItem>
                                    <ListGroupItem key="price" className="d-flex gap-2 mb-2">
                                        Price: <img src={currency?.iconPath} width={24} height={24} alt={String(index)} />{task?.price}
                                    </ListGroupItem>
                                    <ListGroupItem key="description" className="d-flex gap-2 mb-2">
                                        Description: {task?.description}
                                    </ListGroupItem>
                                    <ListGroupItem key="category" className="d-flex gap-2 mb-2">
                                        Category: {currency?.category}
                                    </ListGroupItem>
                                    {record?.status.toLowerCase() === "pending" ? <><Button onClick={() => handleCancel(record._id)} className="mx-auto bg-danger mb-3">
                                        Cancel
                                    </Button></> : <></>}
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
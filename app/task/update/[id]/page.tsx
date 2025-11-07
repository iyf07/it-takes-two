"use client";

import { Container } from 'react-bootstrap';
import TaskUpdate from "@/components/TaskUpdate";

export default async function TaskUpdatePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    
    return (
        <main className="d-flex justify-content-center align-items-center vh-100">
            <Container className="d-flex justify-content-center">
                <TaskUpdate id={id} />
            </Container>
        </main>
    );
}
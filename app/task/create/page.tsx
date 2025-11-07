"use client";

import { Container } from 'react-bootstrap';
import TaskCreate from "@/components/TaskCreate";

export default function TaskCreatePage() {
    return (
        <main className="d-flex justify-content-center align-items-center vh-100">
            <Container className="d-flex justify-content-center">
                <TaskCreate />
            </Container>
        </main>
    );
}
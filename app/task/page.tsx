"use client";

import { Container } from 'react-bootstrap';
import TaskMain from "@/components/TaskMain";

export default function TaskMainPage() {
    return (
        <main className="d-flex justify-content-center align-items-center vh-100">
            <Container className="d-flex justify-content-center">
                <TaskMain />
            </Container>
        </main>
    );
}
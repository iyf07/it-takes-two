"use client";

import { Container } from 'react-bootstrap';
import UserAccount from "@/components/UserAccount";

export default function UserAccountPage() {
    return (
        <main className="d-flex justify-content-center align-items-center vh-100">
            <Container className="d-flex justify-content-center">
                <UserAccount />
            </Container>
        </main>
    );
}
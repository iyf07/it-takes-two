"use client";

import { Container } from 'react-bootstrap';
import UserSignUp from "@/components/UserSignUp";

export default function UserSignUpPage() {
    return (
        <main className="d-flex justify-content-center align-items-center vh-100">
            <Container className="d-flex justify-content-center">
                <UserSignUp />
            </Container>
        </main>
    );
}
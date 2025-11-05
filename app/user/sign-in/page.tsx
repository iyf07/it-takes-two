"use client";

import { Container } from 'react-bootstrap';
import UserSignIn from "@/components/UserSignIn";

export default function UserSignInPage() {
    return (
        <main className="d-flex justify-content-center align-items-center vh-100">
            <Container className="d-flex justify-content-center">
                <UserSignIn />
            </Container>
        </main>
    );
}
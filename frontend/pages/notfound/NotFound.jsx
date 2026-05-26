// src/pages/notfound/NotFound.jsx
import React from "react";
import { Link } from "react-router-dom";
import Typography from "../../components/ui/Typography";
import Button from "../../components/ui/Button";
import { Wrapper } from "./NotFound.styles";

const NotFound = () => {
    return (
        <Wrapper>
            <Typography as="h1" size="xl" weight="bold">
                404
            </Typography>
            <Typography size="sm" color="muted">
                The page you are looking for does not exist.
            </Typography>
            <Button as={Link} to="/dashboard">
                Go to dashboard
            </Button>
        </Wrapper>
    );
};

export default NotFound;

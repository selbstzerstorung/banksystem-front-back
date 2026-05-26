// src/components/layout/HeaderSkeleton.jsx
import React from "react";
import styled from "styled-components";
import { SkeletonBox, SkeletonCircle } from "../ui/Skeleton";

const Wrapper = styled.div`
    width: 100%;
    background: ${({ theme }) => theme.background.card};
    border-bottom: 1px solid ${({ theme }) => theme.borders.color};
    padding: 14px 22px;
`;

const Row = styled.div`
    max-width: 1240px;
    margin: 0 auto;

    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const Left = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
`;

const Right = styled.div`
    display: flex;
    gap: 16px;
`;

const HeaderSkeleton = () => {
    return (
        <Wrapper>
            <Row>
                <Left>
                    <SkeletonCircle size="40px" />
                    <SkeletonBox width="120px" height="20px" radius="6px" />
                </Left>

                <Right>
                    <SkeletonBox width="70px" height="20px" radius="6px" />
                    <SkeletonBox width="90px" height="20px" radius="6px" />
                    <SkeletonCircle size="32px" />
                </Right>
            </Row>
        </Wrapper>
    );
};

export default HeaderSkeleton;

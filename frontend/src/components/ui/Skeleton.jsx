// src/components/ui/Skeleton.jsx
import styled, { keyframes } from "styled-components";

const shimmer = keyframes`
    0% { background-position: -200px 0; }
    100% { background-position: calc(200px + 100%) 0; }
`;

export const SkeletonBox = styled.div`
    width: 100%;
    height: ${({ height }) => height || "16px"};
    margin-bottom: ${({ mb }) => mb || 0};
    border-radius: 12px;
    background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0.04),
            rgba(255, 255, 255, 0.08),
            rgba(255, 255, 255, 0.04)
    );
    background-size: 200px 100%;
    animation: ${shimmer} 1.2s infinite linear;
`;

export const SkeletonText = styled(SkeletonBox)`
    width: ${({ width }) => width || "100%"};
    height: ${({ size }) => size || "16px"};
`;

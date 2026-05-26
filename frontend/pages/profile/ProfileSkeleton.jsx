// src/pages/profile/ProfileSkeleton.jsx
import React from "react";
import { SkeletonText, SkeletonBox } from "../../components/ui/Skeleton";
import Section from "../../components/ui/Section";
import Card from "../../components/ui/Card";

const ProfileSkeleton = () => {
    return (
        <Section>
            <SkeletonText size="28px" width="40%" mb="24px" />

            <Card>
                <SkeletonText size="18px" width="80%" mb="14px" />
                <SkeletonText size="18px" width="60%" mb="14px" />
                <SkeletonText size="18px" width="55%" mb="14px" />
                <SkeletonText size="18px" width="70%" mb="14px" />
                <SkeletonText size="18px" width="50%" />
            </Card>
        </Section>
    );
};

export default ProfileSkeleton;

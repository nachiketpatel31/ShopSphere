import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { EmptyState } from '../components/common/EmptyState';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto px-4 py-24">
      <EmptyState
        icon={Compass}
        title="404 — Page Uncharted"
        description="The editorial story, product, or destination you are seeking cannot be found or has moved."
        actionText="Return to Storefront"
        onAction={() => navigate('/')}
      />
    </div>
  );
};

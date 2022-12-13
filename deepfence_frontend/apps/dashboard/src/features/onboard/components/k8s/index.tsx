import { useNavigate } from 'react-router-dom';
import { Button } from 'ui-components';

import { ConnectorHeader } from '../ConnectorHeader';
import { K8Connection } from './K8Connection';

export const K8sConnection = () => {
  const navigate = useNavigate();
  const goback = () => {
    navigate(-1);
  };
  const goNext = () => {
    navigate('/onboard/choose-scan/k8s');
  };
  return (
    <div>
      <ConnectorHeader
        title="Connect a Kubernetes Cluster"
        description="Deploy all modules for Deepfence Compliance Scanner for a single account. For information on AWS Organization and account types, see AWS docs."
      />
      <div className="flex gap-x-2 flex-col sm:flex-row flex-1">
        <K8Connection />
      </div>
      <div className="flex flex-row mt-16">
        <Button onClick={goback} outline size="xs">
          Cancel
        </Button>
        <Button onClick={goNext} color="primary" size="xs" className="ml-auto">
          Continue
        </Button>
      </div>
    </div>
  );
};

# Deployment to Kubernetes

You can run the OpenEEW detection engine as a standalone Docker container on your laptop, a Raspberry Pi device, or another computer. But you can also deploy it to a Kubernetes cluster such as the [IBM Container Service](https://www.ibm.com/cloud/container-service/) or [Red Hat OpenShift](https://www.ibm.com/cloud/openshift).

## Set up a Kubernetes cluster on the IBM Cloud

Register for an [IBM Cloud account](https://developer.ibm.com/dwwi/jsp/register.jsp?eventid=cfc-2020-projects), then set up a [free single worker node Kubernetes cluster](https://cloud.ibm.com/docs/containers?topic=containers-getting-started#clusters_gs).

Note: You can also choose a more scalable Kubernetes or OpenShift cluster, but those are not free.

- In the [IBM Cloud Catalog](https://cloud.ibm.com/catalog?category=containers), select **Kubernetes Service**. A cluster configuration page opens.
- From the plan dropdown, select the **Free** cluster option.
- Give your cluster a unique name, such as `openeew-free`.
- Select a resource group to create the cluster in, such as `default`.
- In the **Summary** pane, review the order summary and then click **Create**. A worker pool is created that contains one worker node in the default resource group.

While your cluster is provisioning, set up your local workstation with the client tools.

- Download and install a few CLI tools and the Kubernetes Service plug-in.

  ```shell-script
  curl -sL https://ibm.biz/idt-installer | bash
  ```

- Log in to your IBM Cloud account. Include the --sso option if you have a federated ID.

  ```shell-script
  ibmcloud login -a cloud.ibm.com -r us-south -g default
  ```

- Set the Kubernetes context to your cluster for this terminal session. This command will fail if the cluster isn't yet ready.

  ```shell-script
  ibmcloud ks cluster config --cluster <your cluster id>
  ```

- Verify that you can connect to your cluster.

  ```shell-script
  kubectl config current-context
  ```

- Now, you can run `kubectl` commands to manage your cluster on the IBM Cloud. For a full list of commands, see the [Kubernetes docs](https://kubectl.docs.kubernetes.io/).

## Run a deployment containing the Docker container

You can now deploy the `openeew/dashboard` app to your cluster.

- Select your cluster from the [cluster list](https://cloud.ibm.com/kubernetes/clusters) to open the details for your cluster.
- Click **Kubernetes dashboard**.
- From the menu bar, click the **Create new resource** icon (+).
  - Update the **container image** in [openeew-dashboard YAML](openeew-dashboard.yaml)
  - If using a private image registry, update the **imagePullSecrets**
  - Copy the [openeew-dashboard YAML](openeew-dashboard.yaml)
  - In the **Create from input** box, paste the openeew-dashboard YAML that you copied in the previous step.
  - Click **Upload**. The node port service and deployment is created.
- From the menu, click **Service > Services**, and note the TCP endpoint port of your container in the node port range `30000 - 32767`, by default it will be `openeew-dashboard:31700 TCP`.
- From the menu, click **Workloads > Pods**, and note the **Node** that your pod runs on, such as `10.xxx.xxx.xxx`.
- Return to the [IBM Cloud clusters console](https://cloud.ibm.com/kubernetes/clusters), select your cluster, and click the **Worker Nodes** tab. Find the **Public IP** of the worker node that matches the private IP of the node that the pod runs on. In your browser, navigate to **http://YourPublicIP:37000**. It may take a minute for the openeew-dashboard client to start. The url will automatically refresh when it is complete, allowing you to use the openeew-dashboard.

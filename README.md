# Continuous Integration and rolling updates for AWS cloud application

## Description
Configured Jenkins server jobs for provisioning AWS Instance & deploying Node.js web application- checkbox.io & software enterprise Java system iTrust, automatically using Ansible script. Created a git hook on Jenkins server that will trigger a deployment job when doing a git push to production server. Implemented rolling update strategy using Ansible where each instance is reployed while others remain operational.

### CHECKBOXIO NOMAD setup
1. Create a new folder on your machine say "folder" and download in it the Vagrantfile present in nomad/ folder of this repo
2. cd folder
3. vagrant up
4. vagrant ssh control
5. Install git, ansible
6. Clone this repository & cd into Milestone3/nomad
7. Set up keys (on path mentioned in inventory) so ansible-playbook can be run on nomad1, nomad2 and nomad3 from control
8. ansible-playbook configure-control-server.yml
9. export MONGO_USER=mongoAdmin
10. export MONGO_PASSWORD=*password of choice*
11. export MAIL_PASSWORD=*mail password*
12. ansible-playbook -i inventory setup_nomad_cluster.yml
   
### CHECKBOXIO DEPLOYMENT, REDIS FEATURE FLAG, CANARY RELEASE setup
1. Using vagrant create two xenial VMs (one with ansible & one which will eventually host jenkins). Setup ssh keys as in workshop & create inventory
2. Ssh into ansible host and run the following steps
3. Install git, ansible, pip, boto, boto3
4. Clone this repository
5. export AWS_SECRET_KEY=*your secret key*
6. export AWS_ACCESS_KEY_ID=*your access key*
7. export MONGO_PASSWORD=*password of choice*
8. export MONGO_USER=mongoAdmin
9. export MONGO_PORT=3002
10. export MAIL_USER=*your email*
11. export MAIL_PASSWORD=*your email password*
12. export MAIL_SMTP=mock
13. Provision MongoDB server using command - ansible-playbook /home/ubuntu/Milestone3/pipeline/provision-dbserver.yml
14. Bring up jenkins server using command - ansible-playbook -i inventory /home/ubuntu/Milestone3/pipeline/jenkins.yml
15. Do a git push as demonstrated in the video to trigger rest of the automated pipeline **(hook used: pre-push)** 

### CHECKBOXIO DEPLOYMENT, REDIS FEATURE FLAG, CANARY RELEASE images for architecture and better understanding
![checkboxiosetup](https://media.github.ncsu.edu/user/5748/files/0daeae2c-c96b-11e7-9106-05573d7f55ae)
![redis-feature](https://media.github.ncsu.edu/user/5748/files/18c6cd12-c96b-11e7-8ce4-dba4ef4f3ffd)
![canary](https://media.github.ncsu.edu/user/5748/files/1e9866ce-c96b-11e7-9991-bf47708cdce1)

## ITrust ROLLING UPDATES:
- 5 instances of EC2 are initiated and iTrust is deployed on each of them.
- In order to implement rolling update an ansible play-book is used which deploys updated war onto the available servers one at a time. This involves shutting down the server, deploying the war and then restarting the server.
- This ensures that changes are reployed only on one server at a given point of time.

### Setup
1. Using vagrant create two xenial VMs (one with ansible & one which will eventually host jenkins). Setup ssh keys as in workshop & create inventory
2. Ssh into ansible host and run the following steps
3. Install git, ansible, pip, boto, boto3
4. Clone this repository
5. export AWS_SECRET_KEY=*your secret key*
6. export AWS_ACCESS_KEY_ID=*your access key*
7. export MONGO_PASSWORD=*password of choice*
8. export MONGO_USER=mongoAdmin
9. export MONGO_PORT=3002
10. export MAIL_USER=*your email*
11. export MAIL_PASSWORD=*your email password*
12. export MAIL_SMTP=mock
13. Bring up jenkins server using command - ansible-playbook -i inventory /home/ubuntu/Milestone3/pipeline/jenkins.yml
14. Do a git push as demonstrated in the video to trigger rest of the automated pipeline **(hook used: pre-push)** 
15. Initial push should trigger 5 new EC2 instances and should deploy iTrust on them (Deployment)
16. All further pushes will trigger only rolling updates one by one provisioned EC2 instances as in step 15
17. Make changes to the Webroot/auth/admin/home.jsp so that Rolling update can be seen one by one on EC2 update

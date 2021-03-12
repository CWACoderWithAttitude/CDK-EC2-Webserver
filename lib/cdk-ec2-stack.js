const cdk = require("@aws-cdk/core")
const ec2 = require("@aws-cdk/aws-ec2")

class CDKEC2Stack extends cdk.Stack {
  

  constructor(scope, id, props) {
    super(scope, id, props)

    const keyPairName = "aws-eb2"
    
    const vpc = new ec2.Vpc(this, "Vpc", {
      cidr: "10.0.0.0/16",
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: "Public1",
          subnetType: ec2.SubnetType.PUBLIC,
        },
        {
          cidrMask: 24,
          name: "Public2",
          subnetType: ec2.SubnetType.PUBLIC,
        },
        {
          cidrMask: 24,
          name: "Public3",
          subnetType: ec2.SubnetType.PUBLIC,
        },
        {
          cidrMask: 24,
          name: "Private1",
          subnetType: ec2.SubnetType.PRIVATE,
        },
      ],
    })

    const securityGroup = new ec2.SecurityGroup(this, "SecurityGroup", { vpc })
    securityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(80),
      "Allow HTTP access from the world"
    )
    securityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(22),
      "Allow SSH access from the world"
    )

    const machineImage = new ec2.AmazonLinuxImage({
      generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
    })

    const instance = new ec2.Instance(this, "Instance", {
      instanceType: "t2.micro",
      machineImage,
      vpc,
      vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
      keyName: keyPairName,
      securityGroup,
    })

    // Add a script to the EC2 instance
    instance.addUserData(`
      #!/usr/bin/env bash
      su ec2-user
      sudo yum install httpd.x86_64 -y
      sudo service httpd start
      sudo su -c 'cat > /var/www/html/index.html <<EOL
      <html>
        <head>
          <title>Call to Arms</title>
          <style>
            html, body { background: #000 padding: 0 margin: 0 }
            img { display: block margin: 0px auto }
          </style>
        </head>
        <body>
y          <img src='https://media.giphy.com/media/10YoCxWqM3NHxK/giphy.gif' height='100%'/>
        </body>
      </html>
      EOL'
    `)

    /*
    |* https://aws.amazon.com/de/blogs/compute/new-using-amazon-ec2-instance-connect-for-ssh-access-to-your-ec2-instances/
    |* https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-key-pairs.html
    */
    instance.addUserData(`
      #!/usr/bin/env bash
      su ec2-user
      cat > ~/.ssh/authorized_keys <<EOL
      ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQDgBSQWs8u7tWYAnoza1MwyrOkHn+WknhIjFosDVLXeD+W9ZvPRsd8FSGLQgvShv0gBfxeFmH1SO4zKbMn03mLNfACPF8fIkuKnXqTY4kJ0JYQW2PzKXV08y8Hf4G2Okq0TUNvbhpada2AGQiOKDJzIwAZie2cxkChmar7J6OiT6WI7n+izirbMatl2xqAymtTsxAaYTAPTVMbadmckO2YAMZ+vyh3gPZqKnK1EM/oCnbPWgCRTAygB14fWFqShquuTGv3WHePQOPlXJp/+Fe0gcTAlIlzKUW+YsgqhO8Wx0IcmjX6GseZDpD7TT5r5Ol+Du9bY1jMKCYOdozMqTE2WrI7Id4ZmNYjJ+31t8sLTi9MJlrCQKn2PmgNmWBN6o7cLykdj2tPqUn5WI4O5vJ0EsX2dUSFoIa7Lt1l9lFnQ6UFLsP8g8+NE2IgXRxdFpj8XiVsRzzLIztm8Nq4ufwQ3U0OPGHqiJoqeJ/nxNHWfkvFE77WXdO5AHCBll2vMEKQmVPOcop0kp2XwUQbhjZp1Nr5uGI7vq9hUVvCyrYbc5r4rIjKjjdWd5Hq+ptmPhE8gsE97wI+5KLHA7wZGBeWNu4bCQ+Gaj3y1tTZ/+to++Icnay7IW3rdpUvObLcyy7i35wq3k9anmt8zueAvFAXwGIY+ioFZ6sq/kqdM0sStmQ== cwacoderWithAttitude@gmail.com
      EOL
    `)

    // Define the Public DNS as output
    new cdk.CfnOutput(this, "Public DNS (IPv4)", {
      value: instance.instancePublicDnsName,
    })
  } // end constructor
}

module.exports = { CDKEC2Stack }

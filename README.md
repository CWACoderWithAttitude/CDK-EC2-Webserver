# CDK: EC2 Instance Setup IaC

I found this somewhere on the internet - all credits to the respective author.
My part was just adding ssh- and key-configuration.

## What will be shown
1. setting up 
## Caveats

I omitted creating a KeyPair for now. For this example you need to use one of your existing keys:
```
$> aws ec2 describe-key-pairs
    "KeyPairs": [
        {
            "KeyPairId": "key-06ce68515ed7b5a11",
            "KeyFingerprint": "4c:22:31:90:7d:84:81:5e:23:f3:cb:e5:fd:8f:79:75:2b:4f:00:01",
            "KeyName": "devenv-key",
            "Tags": []
        }, {
            "KeyPairId": "key-0fccf96c56c798fc5",
            "KeyFingerprint": "e8:80:70:64:65:c2:cd:d0:f9:7a:fe:9f:f5:bf:77:b8",
            "KeyName": "aws-eb2",
            "Tags": []
        }, {
            "KeyPairId": "key-0fbb54a19ee6325e6",
            "KeyFingerprint": "22:19:57:b9:ad:1b:59:54:72:6e:98:90:c7:c7:68:2e:9a:b1:d0:10",
            "KeyName": "VolkersKeyPair",
            "Tags": []
        }, {
            "KeyPairId": "key-06a61c2cbdbfff3cf",
            "KeyFingerprint": "e2:e7:b1:26:5b:e2:b5:f2:5f:26:32:b4:7f:c4:d2:72:ad:7e:4e:10",
            "KeyName": "testVolkersKeyPair",
            "Tags": []
        }
    ]
}
```

and specify it in `keyPairName`.

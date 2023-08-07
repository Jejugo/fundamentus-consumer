# fundamentus-consumer
Server side application that retrieves data from fundamentus stockshare information

# Useful EC2 commands:

- Check which ports are running: `sudo netstat -tulpn`

## Certification and Ngnx
- Install certbot and ngnx:
```
  sudo python3 -m venv /opt/certbot/
  sudo /opt/certbot/bin/pip install --upgrade pip
  sudo /opt/certbot/bin/pip install certbot certbot-nginx
  sudo ln -s /opt/certbot/bin/certbot /usr/bin/certbot
```

- Add SSL certification to NGNX: `sudo certbot --nginx`
- Restart ngnx: `sudo service nginx restart`
- Start ngnx: `sudo systemctl start nginx`

## Cloudwatch
- Cloudwatch setup wizard `sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-config-wizard`
- Start cloudwatch on Amazon Linux 2 2023: `sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -a fetch-config -s -m ec2 -c file:/opt/aws/amazon-cloudwatch-agent/etc/config.json`
- Check cloudwatch agent: `sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -m ec2 -a status` or `sudo systemctl status amazon-cloudwatch-agent`
- Stop cloudwatch agent: `sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -m ec2 -a stop`
- Start cloudwatch agent: `sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -m ec2 -a start`
- Check configurations: `cat amazon-cloudwatch-agent.json`


/opt/aws/amazon-cloudwatch-agent/bin/config.json
/opt/aws/amazon-cloudwatch-agent/etc/
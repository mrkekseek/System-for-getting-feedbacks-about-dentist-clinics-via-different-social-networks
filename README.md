![patiëntenreview logo flat-03.png](https://bitbucket.org/repo/zdX58n/images/796034280-pati%C3%ABntenreview%20logo%20flat-03.png)

# README #

**Patiëntenreview** web application allows doctors, dentists and other healthcare providers to easily send email invitations for reviews and feedback to their clients. Unique about this software is that it allows for direct rating from the email message as well as a direct follow through to a number of online review profiles: Facebook, Google, Independer, Zorgkaart and a few others.

### How do I get set up? ###

* Database configuration:
Patiëntenreview web application runs on a MySQL database named cloudroc_pr_production. Contact repo-owner for login details.
* Emails:
Patiëntenreview uses Mailgun for sending emails. In the future we might want a deeper integration of the API to track clicks, unsubscribes and bounces, as well as inbound e-mail address where every user has a unique email address so that we can track conversations right from the Patiëntenreview -> Inbox -> Detail view.

* Deployment instructions
In the near future we'll be using an AWS instance for our production environment.

### Contribution guidelines ###

* If you prefer to work on your own local server, please also pull the latest changes to the development version on our test server. It's located at 37.97.132.90 - URL: http://pr.cloudrocket.co
* Please always use proper CodeIgniter database migrations so that database schemes keep synchronised across different versions.
* Do not close issues if you worked on them. Just add a comment so that the project manager can test it. If it is deemed to be good enough to merge to production, we will ask you to do so.

### Who do I talk to? ###

* Repo owner: Nick from Cloudrocket - development@cloudrocket.co - +31(0)6 301 953 02
* Business contact: Wouter from Patiëntenreview - wouter@patientenreview.nl
<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

<!-- PROJECT LOGO -->
<br />

<p align="center">


  <h3 align="center">Myntra Repurpose</h3>

  <p align="center">
    An awesome website to make online thrifting market organized and mainstream. Made with Love.
    <br />
    <a href="https://github.com/FAST-ASDA/repurpose-server"><strong>Explore the docs »</strong></a>
    <br />
    ·
    <a href="https://github.com/FAST-ASDA/repurpose-server/issues">Report Bug</a>
    ·
    <a href="https://github.com/FAST-ASDA/repurpose-server/issues">Request Feature</a>
  </p>
</p>

  
<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgements">Acknowledgements</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

Peer-to-Peer exchange of clothes is still unorganized and with the rise of  the thrifting market, there is a dire need for a platform with history of clothing business to unify these sellers and give the consumers a platform to not only exchange clothes but also recommend the next new set of shoes available on Myntra that would match them. Myntra Repurpose is conceptualized on the Socialise Theme of Hackerramp


### Built With

- [Node.Js](https://nodejs.org/en/)
- [AWS](https://aws.amazon.com/)
- [Heroku](https://www.heroku.com/)

<!-- GETTING STARTED -->

## Getting Started

To get a local copy up and running follow these simple example steps.

### Prerequisites

- [Node v12+](https://nodejs.org/en/)
- Make a bucket on Amazon AWS S3 and download the keys. Make sure your bucket is public.
- Create an .env file with the following keys.

  ```
  NODE_ENV=development
  PORT=5000
  JWT_SECRET=<secret>
  DB_HOST=<database host>
  DB_USER=<database user>
  DB_PASS=<database password>
  DB=<database schema>
  AWS_ACCESS_KEY=<aws access key>
  AWS_SECRET_KEY=<aws secret key>
  AWS_BUCKET=<aws bucket name>
  AWS_REGION=<aws region>
  ```
 

### Installation

1. Clone the repo
   ```
   $ git clone https://github.com/FAST-ASDA/repurpose-server.git
   $ cd repurpose-server
   ```
2. Install Dependencies
   ```
   $ npm install
   ```
3. Run Server
   ```
   $ npm start
   ```

<!-- USAGE EXAMPLES -->

## Usage

All API Endpoints are listed here 
[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/17441383-7eee50d9-cfb3-4f2f-b973-e27f119a9c2b?action=collection%2Ffork&collection-url=entityId%3D17441383-7eee50d9-cfb3-4f2f-b973-e27f119a9c2b%26entityType%3Dcollection#?env%5Brepurpose%20server%5D=W3sia2V5IjoiVVJMIiwidmFsdWUiOiJodHRwOi8vbG9jYWxob3N0OjUwMDAiLCJlbmFibGVkIjp0cnVlfSx7ImtleSI6IlRPS0VOIiwidmFsdWUiOiIiLCJlbmFibGVkIjp0cnVlfSx7ImtleSI6InJlc291cmNlSWQiLCJ2YWx1ZSI6IiIsImVuYWJsZWQiOmZhbHNlfSx7ImtleSI6IlBST0RVUkwiLCJ2YWx1ZSI6Imh0dHBzOi8vbWFwaS5veHl0b2Npbi5pcyIsImVuYWJsZWQiOmZhbHNlfV0=)


<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.
<a href="https://github.com/FAST-ASDA/repurpose-server/blob/master/CONTRIBUTING.md">Read our contributing guidelines</a>


<!-- CONTACT -->

## Contact

- [Shiva Gupta](https://www.linkedin.com/in/shiva-gupta-1843b6170/) (mailto: shivagupta4639@gmail.com) (Team Leader)
- [Anikash Chakraborty](https://www.linkedin.com/in/anikash-chakraborty/) (mailto: akh.chakraborty11@gmail.com)
- [Divyansh Goel](https://www.linkedin.com/in/divyansh-goel-a0a433166/) (mailto: divyanshgoel1999@gmail.com)
- [Akshat Tiwari](https://www.linkedin.com/in/akshaaatt/)

<!-- ACKNOWLEDGEMENTS -->



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/FAST-ASDA/repurpose-server.svg?style=for-the-badge
[contributors-url]: https://github.com/FAST-ASDA/repurpose-server/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/killer4639/sach-ka-saamna.svg?style=for-the-badge
[forks-url]: https://github.com/FAST-ASDA/repurpose-server/network/members
[stars-shield]: https://img.shields.io/github/stars/killer4639/sach-ka-saamna.svg?style=for-the-badge
[stars-url]: https://github.com/FAST-ASDA/repurpose-server/stargazers
[issues-shield]: https://img.shields.io/github/issues/killer4639/sach-ka-saamna.svg?style=for-the-badge
[issues-url]: https://github.com/FAST-ASDA/repurpose-server/issues
[license-shield]: https://img.shields.io/github/license/killer4639/sach-ka-saamna.svg?style=for-the-badge
[license-url]: https://github.com/FAST-ASDA/repurpose-server/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/shiva-gupta-1843b6170/


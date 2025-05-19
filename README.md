# Airsoft community page, take 2

- main page should have a listing of all events
- clicking on events should take the user to the details page

- there should be a dashboard page for every user 
- should display user created events, applications pending / accepted


RSVP System

User sees an event → Clicks "Apply to Join"
→ Fills out optional questions → Submits application
→ Status becomes: Pending Approval or Auto-Accepted (if open)
→ Organizer reviews applicants → Accepts/Declines
→ Accepted user gets assigned to group (optional)
→ User can cancel RSVP at any time
→ Organizer can send messages or updates to accepted users


## Schema

event: 
title: string
owner: → user id
date: date
timeline: starting, lunch, end etc
location:  → location reference
Max players: number
RSVP deadline: datetime
tags: milsim, etc. string array or string
description: string
rules: string
published: boolean

https://orm.drizzle.team/docs
https://www.better-auth.com/docs
https://github.com/rphlmr/react-router-hono-server

https://react-icons.github.io/react-icons/

### notes
- use viewModels and query functions


- facebook, google twitter card
- honeypot endpoints for logging probing, record it into umami
- health endpoint, with database health reporting? uptime?
- social login, tho it can wait till the end : discord, fb, google, github
- readme with links to used tech
- sse with hono for notifications, messaging?
- automatically refrest event data? comments?
- time, date locale formating
- manifest.json?
- better logging, sentry? window.onerror handler
- favicon apple touch icons
- robots.txt sitemap.xml
- env banner (dev, production), versioning
- more error boundaries
- seed script for db
- metadata on routes
- response compression
- notifications VAPID
- mainfest file for mobile install
- geolocation GPS
- ical reminder
- console.onerror handler


## mistakes were made
- form had the name mail instead of email
- betterauth had a process env on the client
- need to call createAuth on top level if used in client


# pages needed
- home template
- main> lists events, paginates
- event details page> shows event title, data etc.
- event signup page> user fills in request to join event


- there should be a view component and a component for data / actions
- 

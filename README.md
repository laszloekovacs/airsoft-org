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




### notes
- use viewModels and query functions

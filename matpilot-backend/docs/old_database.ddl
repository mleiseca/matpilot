create table databasechangeloglock
(
  id integer not null
    constraint pk_databasechangeloglock
    primary key,
  locked boolean not null,
  lockgranted timestamp,
  lockedby varchar(255)
)
;

create table databasechangelog
(
  id varchar(255) not null,
  author varchar(255) not null,
  filename varchar(255) not null,
  dateexecuted timestamp not null,
  orderexecuted integer not null,
  exectype varchar(10) not null,
  md5sum varchar(35),
  description varchar(255),
  comments varchar(255),
  tag varchar(255),
  liquibase varchar(20),
  contexts varchar(255),
  labels varchar(255),
  deployment_id varchar(10)
)
;

create table authority
(
  id varchar(255) not null
    constraint authority_pkey
    primary key,
  version bigint not null,
  authority varchar(255) not null
    constraint uk_nrgoi6sdvipfsloa7ykxwlslf
    unique
)
;

create table event
(
  id varchar(255) not null
    constraint event_pkey
    primary key,
  version bigint not null,
  gym_id varchar(255) not null,
  scheduled_event_id varchar(255),
  end_date_time timestamp not null,
  creator_id varchar(255) not null,
  timezone varchar(255) not null,
  description varchar(255) not null,
  start_date_time timestamp not null,
  constraint uk36a8813b334119fdda6eec9bcc0d
  unique (start_date_time, scheduled_event_id)
)
;

create table event_member_attendance
(
  id varchar(255) not null
    constraint event_member_attendance_pkey
    primary key,
  version bigint not null,
  member_id varchar(255) not null,
  event_id varchar(255) not null
    constraint fke4a5spv9pwptqntsjdsojij8k
    references event,
  constraint uk27f2b4221266928c1f97edab51e9
  unique (member_id, event_id)
)
;

create table gym
(
  id varchar(255) not null
    constraint gym_pkey
    primary key,
  version bigint not null,
  name varchar(255),
  default_timezone varchar(255),
  description varchar(255)
)
;

alter table event
  add constraint fk7tbivehe0ds66peh76etnxrm6
foreign key (gym_id) references gym
;

create table member
(
  id varchar(255) not null
    constraint member_pkey
    primary key,
  version bigint not null,
  gym_id varchar(255) not null
    constraint fk1dghm98ky7wlaauqjf26qkvlr
    references gym,
  first_name varchar(255) not null,
  last_name varchar(255) not null
)
;

alter table event_member_attendance
  add constraint fkr7kwjtamdl73u9jgje05a1sfb
foreign key (member_id) references member
;

create table scheduled_event
(
  id varchar(255) not null
    constraint scheduled_event_pkey
    primary key,
  version bigint not null,
  gym_id varchar(255) not null
    constraint fkgppqfsl4dj832dv9y7lgm28e3
    references gym,
  until_date_time timestamp,
  end_date_time timestamp not null,
  rrules bytea not null,
  creator_id varchar(255) not null,
  timezone varchar(255) not null,
  description varchar(255) not null,
  start_date_time timestamp not null
)
;

alter table event
  add constraint fkhkqeq1kxfue7in0f1kuhamgip
foreign key (scheduled_event_id) references scheduled_event
;

create table user_authority
(
  user_id varchar(255) not null,
  authority_id varchar(255) not null
    constraint fkgvxjs381k6f48d5d2yi11uh89
    references authority,
  constraint user_authority_pkey
  primary key (user_id, authority_id)
)
;

create table users
(
  id varchar(255) not null
    constraint users_pkey
    primary key,
  version bigint not null,
  gym_id varchar(255) not null
    constraint fkj88949d0ybov2j0g2xhvoxmi7
    references gym,
  gym_role varchar(255) not null,
  first_name varchar(255),
  username varchar(255) not null
    constraint uk_r43af9ap4edm43mmtq01oddj6
    unique,
  password varchar(255),
  last_name varchar(255),
  enabled boolean not null
)
;

alter table event
  add constraint fk1h6eb0wh6dq1j6h52570b4keg
foreign key (creator_id) references users
;

alter table scheduled_event
  add constraint fk257bexj4p2s4hyk4d1k87nexo
foreign key (creator_id) references users
;

alter table user_authority
  add constraint fkhi46vu7680y1hwvmnnuh4cybx
foreign key (user_id) references users
;


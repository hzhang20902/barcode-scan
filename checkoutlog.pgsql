create table checkout_log(
    log_id uuid DEFAULT uuid_generate_v1(),
    employee_id char(7) NOT NULL,
    radio_number char(6) NOT NULL,
    CONSTRAINT fk_radios_checkout FOREIGN KEY(radio_number) REFERENCES radios(radio_number),
    checkout_time timestamptz(0) DEFAULT,
    return_time TIMESTAMPTZ(0) NULL,
    exception varchar NULL,
    exc_logtime TIMESTAMPTZ NULL,
    PRIMARY KEY(log_id)
);

alter table radios
add CONSTRAINT fk_checkout_const unique(radio_number)

SET TIMEZONE='EST'

update checkout_log set checkout_time = checkout_time - interval '4' hour;

--DISPLAY CURRENT:
BEGIN;
select * from departments;
select * from radios;
select * from checkout_log;
COMMIT;

--ADD RADIOS AND SPECIFY TO DEPARTMENTS:
BEGIN;
INSERT INTO radios(db_id, radio_number, status, dept_name)
VALUES(DEFAULT, '123456', 'Available', (SELECT dept_name from departments WHERE dept_name='UNLOAD'));
select * from radios;
select * from checkout_log;
COMMIT;


--CHECKOUT AND UPDATE RADIO STATUS:
BEGIN;
insert into checkout_log
values(DEFAULT, '2002222', '123456', now() - interval '4' hour);
update radios set status ='Checked out' where radio_number = '123456';
select * from checkout_log;
select * from radios;
select * from departments;
COMMIT;


--RETURN AND UPDATE RADIO STATUS:
BEGIN;
update checkout_log set return_time = now() - interval '4' hour
where employee_id = '2002222' and radio_number = '123456';
update radios set status ='Available' where radio_number = '123456';
select * from checkout_log;
select * from radios;
select * from departments;
COMMIT;


alter table checkout_log
alter column exc_logtime
type timestamp(0)




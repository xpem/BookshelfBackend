
  create table book_historic(
    id int primary key AUTO_INCREMENT,
  	created_at datetime not null default NOW(),
    book_id int not null,
    type_id int not NULL,
    CONSTRAINT `FK_book_historic` FOREIGN KEY (book_id) REFERENCES books (id),
    CONSTRAINT `FK_historic_type` FOREIGN KEY (type_id) REFERENCES historic_type (id)
  )

create table historic_type(
      id int primary key AUTO_INCREMENT,
      Name varchar(100)
  ) 
  
  
  insert into historic_type(name) values ('Insert')
  insert into historic_type(name) values ('Update')
  insert into historic_type(name) values ('Delete')
  
 create table book_historic_item(
    id int primary key AUTO_INCREMENT,
    book_field varchar(150) not null,
    updated_from varchar(150) not null,
    updated_to varchar(150) not null,
    book_historic_id int not null,
   CONSTRAINT `FK_book_historic_item` FOREIGN KEY (`book_historic_id`) REFERENCES `book_historic` (`id`)
  )
  
  
  create table book_comment(
        id int primary key AUTO_INCREMENT,
        comment varchar(350) not null,
    	  created_at datetime not null default NOW(),
        book_id int not null,
        CONSTRAINT `FK_book_comment` FOREIGN KEY (`book_id`) REFERENCES `book` (`id`)
  )
  
  --alterações que envolvam campos referidos na timeline, criam um item de timeline
  create table user_books_timeline(
       id int primary key AUTO_INCREMENT,
       book_historic_id int not null,
       creation_dt datetime not null default NOW(),
       viewed bool not null default false,
    user_id int not null,
       CONSTRAINT `FK_book_historic_timeline` FOREIGN KEY (`book_historic_id`) REFERENCES `book_historic` (`id`),
    CONSTRAINT `FK_book_historic_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
  )
  
  
  
  
  
  
  




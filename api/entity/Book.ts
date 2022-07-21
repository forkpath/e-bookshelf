import {BaseEntity, Column, Entity, PrimaryColumn} from "typeorm"

@Entity()
export class Book extends BaseEntity {
    @PrimaryColumn()
    id: string;

    @Column({comment: '书名'})
    title: string;

    @Column({nullable: true, comment: '作者'})
    author: string;

    @Column({nullable: true, comment: '出版社'})
    publisher: string;

    @Column({name: 'cover_link', comment: '封面id'})
    coverLink: string;

    @Column({comment: 'epub文件链接'})
    link: string;

    @Column({type: 'text', nullable: true, comment: '出版时间'})
    date: string;

    @Column({type: 'text', nullable: true, comment: '语言'})
    language: string;
}

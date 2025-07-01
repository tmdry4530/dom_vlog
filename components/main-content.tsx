"use client"

import { BlogPostCard } from "@/components/blog-post-card"
import { ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"

export function MainContent() {
  const posts = [
    {
      title: "Mysql",
      date: "2023.09.19",
      category: "Computer Science",
      excerpt:
        "SQL 구성요소 데이터 정의어 데이터 조작어 제약조건 SQL 구성요소 데이터 정의어 CREATE – 데이터베이스, 테이블을 생성한다. SHOW – 데이터베이스, 테이블을 보여준다. DROP – 데이터베이스, 테이블을 삭제한다. ALTER – 데이터베이스, 테이블의 구조를 변경한다. 데이터 조작어 INSERT – 새로운 데이터를 테이블에 삽입한다. SELECT – 테이블에서 데이터를 검색할수있고, 조건을 지정해서 원하는 데이터만 검색가능하다. UPDATE – 테이블의 기존 데이터를 수정할수있다. DELETE – 테이블의 데이터를 삭제한다. 데이터 제어어 GRANT – 사용자에게 특정 권한을 부여한다. REVOKE – 사",
    },
    {
      title: "database - mysql",
      date: "2023.09.19",
      category: "Computer Science",
      excerpt:
        "Database DBMS DBMS의 종류 관계형 / 비관계형 SQL Database DB를 배우는 형태 라우터를 잘 나누기. 두 조건이 완벽하게 이뤄지면 DB도 이해하기 쉬움. 시간같아넘기 ㄱㄱ DB란? 정보를 저장하 는 공간 (ex. 디렉토리 내의 폴더라고 생각하면 쉬움) DBMS Database Management System DB를 저장하고 관리하는 프로그램 DB – 데이터를 저장한다. DBMS – DB를 도와주는 프로그램 웹서버 D BMS 리소스를 활용하여 통신이 되야함. DBMS의 종류 Oracle – 유료 Mysql Mariadb postgresql mssql db2 등 ... Oracle은 기업에서 선호하고 Mysql이 대표적으로 많이 쓰인다. 빅데이터라는 분",
    },
    {
      title: "조건문/반복문",
      date: "2023.09.04",
      category: "Blockchain",
      excerpt:
        "조건문 ex) if(조건){코드} : 조건이 참일 경우에 코드블록을 실행함. if ~ else : 조건이 참일 경우 첫번째 코드블록을 실행하고, 거짓일 경우에는 두번째 코드블록을 실행한다. if ~ else if : 여러 조건을 순차적으로 평가하고, 참인 조건의 코드블록만 실행한다. switch : 주어진 표현식의 값에 따라 다양한 코드 블록 중 하나를 실행한다. 값의 경우는 case키워드로 표시되며, 표현식과 일치하는 값의 case 코 드블록이 실행된다. 반복문 초기화 : 반복문이 시작될때 한번만 실행되는 표현식. 반복문에서 사용 할 변수를 선언하고 초기값을 할당한다. ex) for (let i = 0;...) 조건 : 반복문의 각 반복마다 평가되는 표현",
    },
    {
      title: "연산자",
      date: "2023.09.04",
      category: "Blockchain",
      excerpt:
        "연산자란? 연산자(Operator)는 하나 이상의 피연산자(Operand)에 대해 특정 연산을 수행하는 기호나 키워드를 의미합니다. 프로그래밍에서 연산자는 변수나 값들을 조작하여 새로운 값을 만들거나, 조건을 평가하거나, 특정 작업을 수행하는 데 사용됩니다. 연산자의 종류 산술 연산자 (Arithmetic Operators) 덧셈 (+): 두 피연산자를 더합니다. 뺄셈 (-): 첫 번째 피연산자에서 두 번째 피연산자를 뺍니다. 곱셈 (*): 두 피연산자를 곱합니다. 나눗셈 (/): 첫 번째 피연산자를 두 번째 피연산자로 나눕니다. 나머지 (%)",
    },
  ]

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" })

  return (
    <main className="flex-1 p-8 relative max-w-4xl mx-auto">
      <div className="flex justify-center items-center mb-8 relative">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-zinc-50">전체 글</h1>
          <p className="text-sm text-zinc-400">참돔이의 일기장</p>
        </div>
      </div>

      <div className="space-y-8">
        {posts.map((post, index) => (
          <BlogPostCard key={index} {...post} />
        ))}
      </div>

      <Button
        variant="secondary"
        size="icon"
        className="fixed bottom-8 right-8 rounded-full w-12 h-12 bg-zinc-700 text-zinc-50 hover:bg-zinc-600 shadow-lg"
        onClick={scrollToTop}
      >
        <ChevronUp className="h-6 w-6" />
        <span className="sr-only">Scroll to top</span>
      </Button>
    </main>
  )
}

**관련 구상**

# 화면 종류
1) Login : 로그인 화면. 
2) Preview : 게임 전 선택 화면. 좌측 상단에 랭킹, 그림(svg)가 있는 버튼 눌러서 입장 (grid 이용), 우측 상단에 설정 버튼 -> 누르면 오른쪽에서 설정들이 슉 들어오도록. 애니메이션
*게임 종류: play!, create room, training
1) Loading : 로딩 화면. training이랑 동일하게 심심하지 않게. 
2) Game: 게임 화면

# 디자인 관련
그리드 넣어서 눈이 편하게
경계를 원본 게임처럼 검은색으로 하지 말고 내부 색보다 어둡게 맞추는 정도로
tetr.io처럼 경계 색을 불균일하게 해서 입체적인 느낌도
애니메이션을 넣어야. 이벤트와 클래스 토글을 이용해서 구현할 수 있을 듯? 실험해봐야

# 가능한 SignalR 요청 (클라이언트 관련된)
1) Connection 성공: "게임 로딩" -> "연결됨" 상태 전환 (-> ex. Loading 화면에서 메인화면으로 전환)
2) (클->서) RequestGame: 들어갈 게임을 요청. 버튼 클릭으로 Invoke
3) (서->클) GameFound: 들어갈 게임을 찾았음. -> "게임중" 상태로 전환
4) (서->클) UpdateGameState: 게임 상태를 나타내는 JSON -> store의 상태를 바꾸어야 -> Canvas를 업데이트
5) Connection 끊김: 강제로 "게임 로딩"으로 전환

# Redux Store에 필요한 것들
programState (string). string constant들을 이용해서 enum처럼

# Implementation 계획
store.dispatch를 쓰면 component 호출이 아니더라도 re-rendering이 호출됨! -> 1번, 3번, 4번, 5번 케이스는 해결.
2번 케이스는 useDispatch 로 해결.  
canvas 그리는 거는 useEffect와 useRef 이용하면 됨

store와 signalr의 상호작용? signalr을 store에 비해 상위에 놓고, 양쪽 위에 컴포넌트들이 있는 구조
connection.js의 역할: MVC 모델로 따지자면 controller 역할? -> controller.js로 바꿀까??
- signalR을 initialize
- 서버 측 요청에 따라 store를 dispatch하는 "이벤트 핸들러"를 구현
- 컴포넌트들(의 이벤트 핸들러에서)에서 서버 측 함수를 실행할 수 있는 인터페이스 제공 

좀 더 생각. 
연결하는 과정에서 Loading 창을 띄워야??

# State Model
- appState


# Canvas 관련
- 기본 좌표는 픽셀과 무관. 대강 100x100 정도로 잡자. 바닥을 0으로 해서 y축은 위방향 -> 화면 크기에 맞춰서 & y축 방향을 뒤집어서 좌표를 변환한 후에 그려야
- 카메라를 이용. 게임을 더 동적으로. (근데 이건 서버 측에서...)
- Canvas를 기반으로 한 component를 만들까?

# 조사해봐야 할 것들

# 아이디어
화면들을 재미있게 만들어보자

로딩 화면은 공이 반복적으로 벽에 통통 튀기는 걸로 ㄱㄱ

끝날 때 fade-in과 fade-out으로 자연스러운 화면 전환 구현?


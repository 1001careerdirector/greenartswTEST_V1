# 프로젝트1. 시정소식

와글와글 수원 2025년 9월호

# 프로젝트2. 달빛책방

유아독서 멀티미디어 학습지 앱 프로토타입입니다.

## Vercel 배포

이 프로젝트는 별도 빌드가 필요 없는 정적 사이트입니다.

### Vercel CLI로 배포

```powershell
npm i -g vercel
vercel login
vercel --prod
```

처음 배포할 때 질문이 나오면 아래처럼 선택하면 됩니다.

- Set up and deploy: `Y`
- Which scope: 본인 계정 선택
- Link to existing project: `N`
- Project name: `moonlight-reading-app` 또는 원하는 이름
- Directory: `./`
- Override settings: `N`

배포가 끝나면 `https://프로젝트명.vercel.app` 형태의 공유 링크가 표시됩니다.

### Vercel 웹에서 배포

1. Vercel에서 `Add New Project`를 선택합니다.
2. 이 폴더를 GitHub 저장소로 올린 뒤 저장소를 연결합니다.
3. Framework Preset은 `Other`로 둡니다.
4. Build Command는 비워둡니다.
5. Output Directory는 `.`로 둡니다.
6. Deploy를 누릅니다.

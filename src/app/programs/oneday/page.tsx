import ProgramPage from '@/components/ProgramPage';

export default function OnedayPage() {
    return (
        <ProgramPage
            data={{
                badge: '원데이 클래스',
                title: '원데이 클래스',
                subtitle: '10인 이상 단체를 위한 천연 비누, 양초, 자격증반 과정\n하루 만에 완성되는 특별한 공예 경험입니다.',
                heroImage: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&q=80&w=2000',
                categoryColor: '#CD853F',
                overview:
                    '10인 이상 단체를 대상으로 진행하는 원데이 클래스입니다. 천연 비누, 아로마 양초, 프레스드 플라워, 자격증 취득 과정 등 다양한 공예 활동을 제공합니다. 기업 워크숍, 동아리 모임, 가족 행사 등 특별한 날을 더욱 의미 있게 만들어 드립니다.',
                targets: ['기업 팀빌딩 단체', '학교 동아리', '가족 모임 (10인 이상)', '지역 복지관', '여성 단체', '청년 단체'],
                curriculum: [
                    { title: '재료 소개 & 안전 교육', desc: '사용할 천연 재료와 도구를 소개하고 안전한 활동을 위한 기본 교육을 진행합니다.' },
                    { title: '본 활동: 만들기 체험', desc: '비누, 양초, 또는 기타 선택 공예 작업을 전문 강사의 지도 하에 직접 제작합니다.' },
                    { title: '마무리 & 포장', desc: '완성된 작품을 예쁘게 포장하고 기념사진을 찍으며 활동을 마무리합니다.' },
                ],
                features: [
                    { icon: '🕯️', title: '다양한 코스 선택', desc: '비누, 양초, 프레스드 플라워 등 원하는 클래스를 선택할 수 있습니다.' },
                    { icon: '👥', title: '10인 이상 단체 전용', desc: '단체 고객을 위한 특별 구성의 맞춤형 커리큘럼을 제공합니다.' },
                    { icon: '📜', title: '자격증반 운영', desc: '원하시는 분들을 위해 공식 자격증 취득 과정도 운영합니다.' },
                    { icon: '🎁', title: '완성품 가지고 가기', desc: '직접 만든 작품을 선물로 가져가실 수 있습니다.' },
                ],
                ctaText: '원데이 클래스를 신청해보세요',
            }}
        />
    );
}

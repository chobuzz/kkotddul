import ProgramPage from '@/components/ProgramPage';

export default function RentalPage() {
    return (
        <ProgramPage
            data={{
                badge: '공간 대여',
                title: '450평 프라이빗 정원 대여',
                subtitle: 'BBQ, 파티, 노래방, 단체 행사 등\n자연 속의 완벽한 프라이빗 공간이 준비되어 있습니다.',
                heroImage: 'https://images.unsplash.com/photo-1516528387618-afa90b13e000?auto=format&fit=crop&q=80&w=2000',
                categoryColor: '#F4A460',
                overview:
                    '총 450평 규모의 천연쟁이 꽃뜰 프라이빗 정원을 대여하실 수 있습니다. 울창한 수목과 계절 꽃이 어우러진 정원에서 가족 파티, 기업 행사, 동문 모임, 팀 워크숍 등 특별한 순간을 만들어 보세요. BBQ 그릴, 노래방 시설, 야외 무대 등의 부대시설을 함께 이용하실 수 있습니다.',
                targets: ['가족 모임 & 홈파티', '기업 단체 워크숍', '동문 & 동창 모임', '결혼 스몰 웨딩', '생일 파티', '촬영 & 화보 행사'],
                curriculum: [
                    { title: '공간 예약 & 사전 미팅', desc: '희망 날짜와 인원수를 안내드리고, 행사 목적에 맞는 공간 배치와 부대시설을 상담합니다.' },
                    { title: '당일 공간 세팅 & 입장', desc: '예약 시간에 맞춰 공간을 세팅하고 입장 안내를 진행합니다. 필요시 케이터링 연결도 도움드립니다.' },
                    { title: '행사 진행 & 마무리', desc: '행사 시간 동안 스태프가 상주하여 도움을 드리며, 종료 후 정리를 함께합니다.' },
                ],
                features: [
                    { icon: '🏡', title: '총 450평 규모', desc: '넓고 쾌적한 정원으로 50인 이상의 대규모 행사도 가능합니다.' },
                    { icon: '🍖', title: 'BBQ & 야외 파티', desc: 'BBQ 그릴 및 야외 테이블 세팅을 기본으로 제공합니다.' },
                    { icon: '🎤', title: '노래방 시설 완비', desc: '실내 노래방 시설이 갖추어져 있어 완벽한 파티를 즐기실 수 있습니다.' },
                    { icon: '🤫', title: '완전 프라이빗 공간', desc: '예약 시간 동안 다른 팀과 공간이 겹치지 않는 독점 사용입니다.' },
                ],
                ctaText: '날짜와 인원을 알려주시면 바로 확인해드립니다',
            }}
        />
    );
}

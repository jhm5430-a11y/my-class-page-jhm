import csv
import random

# 설정
classes = [f"{i}반" for i in range(1, 6)]
students_per_class = 30
output_file = "c:/Users/jjj54/auto-robot setting/tech_scores.csv"

# 헤더
header = ["학급", "번호", "기말고사(100점/60%)", "수행1(15점)", "수행2(15점)", "수행3(10점)", "총점(100점)"]

data = []

for class_name in classes:
    for i in range(1, students_per_class + 1):
        # 기말고사 점수 (40~100점 사이, 상위권이 좀 더 많게 설정)
        final_exam = random.randint(50, 100)
        
        # 수행평가 점수 (만점에 가깝게 분포)
        p1 = random.randint(10, 15)
        p2 = random.randint(10, 15)
        p3 = random.randint(7, 10)
        
        # 가중치 계산 (기말 60% 반영 시)
        # 총점 = (기말 * 0.6) + 수행1 + 수행2 + 수행3
        total = round((final_exam * 0.6) + p1 + p2 + p3, 2)
        
        data.append([class_name, i, final_exam, p1, p2, p3, total])

# CSV 파일 저장
with open(output_file, 'w', newline='', encoding='utf-8-sig') as f:
    writer = csv.writer(f)
    writer.writerow(header)
    writer.writerows(data)

print(f"성공적으로 {output_file} 파일을 생성했습니다.")

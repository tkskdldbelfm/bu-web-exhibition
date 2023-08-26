document.addEventListener('DOMContentLoaded', () => {
    const commentsList = document.getElementById('comments');
    const commentForm = document.getElementById('commentForm');
    const nicknameInput = document.getElementById('nickname');
    const passwordInput = document.getElementById('password');
    const commentInput = document.getElementById('comment');

    // 댓글 작성 폼 제출 처리
    commentForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const target_id = getParameterByName('id'); // URL에서 id 파라미터 가져오기
        const nickname = nicknameInput.value;
        const password = passwordInput.value;
        const comment = commentInput.value;

        const response = await fetch('/create-comment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ target_id, nickname, password, comment })
        });

        if (response.ok) {
            // 댓글 작성 성공 시 화면 갱신
            loadComments();
        } else {
            // 댓글 작성 실패 시 처리
            console.error('댓글 작성 실패');
        }
    });

    // 댓글 목록 가져오기
    async function loadComments() {
        const response = await fetch(`/get-comments?id=${getParameterByName('id')}`);
        const comments = await response.json();

        // 댓글 목록 표시
        commentsList.innerHTML = '';
        comments.forEach(comment => {
            const li = document.createElement('li');
            li.textContent = comment.comment;

            const deleteButton = document.createElement('button');
            deleteButton.textContent = '삭제';
            deleteButton.addEventListener('click', async () => {
                const deletePassword = prompt('비밀번호를 입력하세요.');
                if (deletePassword) {
                    const deleteResponse = await fetch('/delete-comment', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ comment_id: comment.comment_id, password: deletePassword })
                    });

                    if (deleteResponse.ok) {
                        // 댓글 삭제 성공 시 화면 갱신
                        loadComments();
                    } else {
                        // 댓글 삭제 실패 시 처리
                        console.error('댓글 삭제 실패');
                    }
                }
            });

            li.appendChild(deleteButton);
            commentsList.appendChild(li);
        });
    }

    // URL에서 파라미터 가져오는 함수
    function getParameterByName(name) {
        const url = new URL(window.location.href);
        return url.searchParams.get(name);
    }

    // 초기화: 댓글 목록 불러오기
    loadComments();
}); 
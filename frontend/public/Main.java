import java.util.*;

public class Main {
    static final int MOD = 1000000007; // Large prime for modulo operation

    public static int countWays(int N, int M, int X, int Y, int[] A) {
        // DP table: (M+1) rows for passes, (N+1) columns for positions
        int[][] dp = new int[M + 1][N + 1];

        // Initial condition: The ball starts at X
        dp[0][X] = 1;

        // Fill the DP table
        for (int i = 1; i <= M; i++) { // Pass number
            for (int j = 1; j <= N; j++) { // Current position
                if (dp[i - 1][j] > 0) { // If there were ways to reach position j in i-1 passes
                    // Pass to the left range
                    for (int k = Math.max(1, j - A[i - 1]); k < j; k++) {
                        dp[i][k] = (dp[i][k] + dp[i - 1][j]) % MOD;
                    }

                    // Pass to the right range
                    for (int k = j + 1; k <= Math.min(N, j + A[i - 1]); k++) {
                        dp[i][k] = (dp[i][k] + dp[i - 1][j]) % MOD;
                    }
                }
            }
        }

        // Return the number of ways to reach Y after M passes
        return dp[M][Y];
    }

    public static void main(String[] args) {
        // Example input
        Scanner sc = new Scanner(System.in);

        int N = sc.nextInt(); // Number of players
        int M = sc.nextInt(); // Number of passes
        int X = sc.nextInt(); // ThunderCracker's position
        int Y = sc.nextInt(); // Munkee's position

        int[] A = new int[M];
        for (int i = 0; i < M; i++) {
            A[i] = sc.nextInt();
        }

        System.out.println(countWays(N, M, X, Y, A));

        sc.close();
    }
}